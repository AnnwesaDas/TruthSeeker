import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.



const ParticleBackground = (props) => {

    const [init, setInit] = useState(false);
    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = () => {};


    const options = useMemo(
        () => ({
            
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "repulse",
                    },
                    onHover: {
                        enable: true,
                        mode: 'repulse',
                    },
                },
                modes: {
                    push: {
                        distance: 30,
                        duration: 20,
                    },
                    grab: {
                        distance: 100,
                    },
                    repulse:{
                        distance:50
                    }
                },
            },
            particles: {
                color: {
                    value: "#8db5de",
                },
                links: {
                    color: "#7f54cd",
                    distance: 150,
                    enable: true,
                    opacity: 0.8,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: true,
                    speed: 0.5,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 200,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 2, max: 5 },
                },
                shadow: {
                    enable: true,
                    color: "#8db5de", // or "#7f54cd" for purple glow
                    blur: 12,         // try 8-20 for different glow strengths
                    offset: { x: 0, y: 0 }
                }
            },
            detectRetina: true,
        }),
        [],
    );


    return <Particles id={props.id} init={particlesLoaded} options={options} />;
};

export default ParticleBackground;