import React, { useRef, useEffect } from "react";
import Matter from "matter-js";

const Plinko: React.FC = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const worldRef = useRef<Matter.World | null>(null);
    const matWorld = Matter.World;
    const matEngine = Matter.Engine;
    const matRender = Matter.Render;
    const matRunner = Matter.Runner;
    const matBodies = Matter.Bodies;

    useEffect(() => {
        const engine = matEngine.create();
        const world = engine.world;
        engineRef.current = engine;
        worldRef.current = world;

        const runner = matRunner.create();
        const render = matRender.create({
            element: sceneRef.current!,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                wireframes: false,
                background: "#182434",
            },
        });

        function peg(x: number, y: number) {
            return matBodies.circle(x, y, 4, {
                label: "peg",
                restitution: 0.5,
                isStatic: true,
                render: {
                    fillStyle: "#FFFFFF"
                }
            })
        }

        Matter.Events.on(engineRef.current, 'collisionStart', lightPeg)

        function lightPeg(event: Matter.IEventCollision<Matter.Engine>) {
            event.pairs
                .filter((pair) => pair.bodyA.label === "peg")
                .forEach((pair) => {
                    const peg = pair.bodyA;
                    const origColor = "#FFFFFF";

                    peg.render.fillStyle = "#4c6ef5";

                    setTimeout(() => {
                        peg.render.fillStyle = origColor;
                    }, 500)
                });
        }

        function createPyramid(startX: number, startY: number, rows: number, spacing: number) {
            for (let row = 2; row < rows; row++) {
                for (let col = 0; col <= row; col++) {
                    const x = startX + col * spacing - (row * spacing) / 2;
                    const y = startY + row * spacing;
                    matWorld.add(world, peg(x, y));
                }
            }
        }

        // Create ground
        const ground = matBodies.rectangle(400, 590, 800, 20, { isStatic: true });

        matWorld.add(world, [ground]);

        createPyramid(400, 10, 18, 30)

        matRunner.run(runner, engine)
        matRender.run(render)

        return () => {
            matRender.stop(render);
            matWorld.clear(world, false);
            matEngine.clear(engine);
            render.canvas.remove();
        }
    })

    function ball() {
        return matBodies.circle(400, 10, 8, {
            restitution: 0.5,
            render: {
                fillStyle: "#D70040"
            },
            collisionFilter: {
                group: -1,
            },
        })
    }

    function rand(min: number, max:number) {
        return Math.random() * (max - min) + min;
    }

    const dropBall = () => {
        if (engineRef.current && worldRef.current) {
            const dropppedBall = ball()
            Matter.Body.setVelocity(dropppedBall, {
                x: rand(-0.05, 0.05),
                y: 0
            })

            Matter.Body.setAngularVelocity(dropppedBall, rand(-0.05, 0.05))

            matWorld.add(worldRef.current, dropppedBall);
        }
    }

    return (
        <main className="flex justify-center items-center">
            <div ref={sceneRef} />
            <button onClick={dropBall} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Drop</button>
        </ main>
    );
};

export default Plinko;
