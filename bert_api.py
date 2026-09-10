"""
BERT-based Flask API for claim verification.
Loads a fine-tuned BERT model and exposes endpoints for health checks and predictions.
"""

import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os

# Initialize Flask app
app = Flask(__name__)

# Global variables to store model and tokenizer (loaded once at startup)
model = None
tokenizer = None

# Local folder path for development, or a Hugging Face Hub repo id
# (e.g. "yourusername/truthseeker-bert-liar") for a deployed instance.
MODEL_FOLDER = os.environ.get("BERT_MODEL_ID", "bert-liar-model")


def load_model():
    """
    Load the fine-tuned BERT model and tokenizer, either from a local folder
    or from the Hugging Face Hub (from_pretrained supports both transparently).
    This function is called once at startup to avoid reloading on every request.
    """
    global model, tokenizer

    print(f"Loading model from {MODEL_FOLDER}...")

    # Load tokenizer from the model folder
    tokenizer = AutoTokenizer.from_pretrained(MODEL_FOLDER)

    # Load the fine-tuned model for sequence classification
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_FOLDER)
    
    # Set model to evaluation mode (disables dropout, batch norm updates, etc.)
    model.eval()
    
    print("Model loaded successfully!")


# Load once at import time so this works both under `python bert_api.py`
# (dev) and under a WSGI server like gunicorn (production), which imports
# this module and never executes the `if __name__ == '__main__'` block.
load_model()


@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint.
    Returns a simple status response.
    """
    return jsonify({"status": "ok"}), 200


@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint for claim verification.
    
    Expected JSON body:
        { "claim": "some text to verify" }
    
    Returns JSON:
        { "label": "fake" or "real", "confidence": 0.87 }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate that 'claim' field exists
        if not data or 'claim' not in data:
            return jsonify({"error": "Missing 'claim' field in request body"}), 400
        
        claim = data['claim']
        
        # Tokenize the input text
        # max_length=512: truncate longer texts
        # truncation=True: enable truncation
        # padding=True: pad shorter texts to max_length
        # return_tensors='pt': return PyTorch tensors
        inputs = tokenizer(
            claim,
            max_length=512,
            truncation=True,
            padding=True,
            return_tensors='pt'
        )
        
        # Run model inference without computing gradients (faster, less memory)
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Get logits (raw model outputs)
        logits = outputs.logits
        
        # Apply softmax to convert logits to probabilities
        probabilities = torch.softmax(logits, dim=1)
        
        # Get the predicted class (0 or 1) and its confidence
        predicted_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class].item()
        
        # Map class index to label (assuming 0="fake", 1="real")
        # Adjust this mapping based on your model's training setup
        label_map = {0: "fake", 1: "real"}
        label = label_map.get(predicted_class, "unknown")
        
        # Round confidence to 2 decimal places
        confidence = round(confidence, 2)
        
        # Return the prediction result
        return jsonify({
            "label": label,
            "confidence": confidence
        }), 200
    
    except Exception as e:
        # Return error message if something goes wrong
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Render (and most PaaS platforms) assign the port via $PORT; default to
    # 5001 for local development to match the Node backend's default BERT_API_URL.
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
