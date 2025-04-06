import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Matter from "matter-js";
import x16 from '../assets/plinko/winpath/16x.png'
import x9 from '../assets/plinko/winpath/9x.png'
import x2 from '../assets/plinko/winpath/2x.png'
import x1z4 from '../assets/plinko/winpath/1-4x.png'
import x1z2 from '../assets/plinko/winpath/1-2x.png'
import x1z1 from '../assets/plinko/winpath/1-1x.png'
import x1 from '../assets/plinko/winpath/1x.png'
import x0z5 from '../assets/plinko/winpath/0-5x.png'
import PegSound from '../assets/plinko/sounds/peg.mp3';
import Logo from '../assets/Multiply-Logo.png';
import BackButton from '../assets/back-arrow.svg'

const Plinko: React.FC = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const worldRef = useRef<Matter.World | null>(null);
    const matWorld = Matter.World;
    const matEngine = Matter.Engine;
    const matRender = Matter.Render;
    const matRunner = Matter.Runner;
    const matBodies = Matter.Bodies;
    const currentMoneyRef = useRef(1000);
    const [money, setMoney] = useState(currentMoneyRef.current);
    const [bet, setBet] = useState<number>(0);

    const navigate = useNavigate();

    const homeButton = () => {
        navigate("/Home")
    }

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
                background: "transparent",
            },
        });

        // Pegs Logic
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
                    const pegSound = new Audio(PegSound);
                    pegSound.volume = 0.2;
                    pegSound.play().catch(err => console.error("Audio play error: ", err));

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
        
        createPyramid(400, 10, 18, 30)

        // Ground Logic
        const ground = matBodies.rectangle(400, 600, 1500, 20, { isStatic: true, label: "ground", render: { fillStyle: "transparent", strokeStyle: "transparent", } });

        Matter.Events.on(engineRef.current, 'collisionStart', groundTouch);

        function groundTouch(event: Matter.IEventCollision<Matter.Engine>) {
            event.pairs.forEach((pair) => {
                let ballBody: Matter.Body | null = null;
        
                if (pair.bodyA.label === "ground" && pair.bodyB.label.startsWith("ball")) {
                    ballBody = pair.bodyB;
                } else if (pair.bodyB.label === "ground" && pair.bodyA.label.startsWith("ball")) {
                    ballBody = pair.bodyA;
                }
        
                if (ballBody) {
                    const allBodies = worldRef.current!.bodies;
                    const ballToRemove = allBodies.find((body) => body.id === ballBody!.id);
        
                    if (ballToRemove && worldRef.current!.bodies.includes(ballToRemove)) {
                        Matter.World.remove(worldRef.current!, ballToRemove);
                        console.log(`Ball ID ${ballToRemove.id} removed after touching the ground`);
                    } else {
                        console.warn(`Ball ID ${ballBody.id} already removed or not found`);
                    }
                }
            });
        }        

        matWorld.add(world, [ground]);


        // Winning paths logic
        const sixteenX1 = matBodies.rectangle(160, 550, 25, 20, { isStatic: true, label: "win-sixteenX", render: { sprite: { texture: x16, xScale: 0.5, yScale: 0.5 } }})
        const sixteenX2 = matBodies.rectangle(640, 550, 25, 20, { isStatic: true, label: "win-sixteenX", render: { sprite: { texture: x16, xScale: 0.5, yScale: 0.5 } } })
        const nineX1 = matBodies.rectangle(190, 550, 25, 20, { isStatic: true, label: "win-nineX", render: { sprite: { texture: x9, xScale: 0.5, yScale: 0.5 } } })
        const nineX2 = matBodies.rectangle(610, 550, 25, 20, { isStatic: true, label: "win-nineX", render: { sprite: { texture: x9, xScale: 0.5, yScale: 0.5 } } })
        const twoX1 = matBodies.rectangle(220, 550, 25, 20, { isStatic: true, label: "win-twoX", render: { sprite: { texture: x2, xScale: 0.5, yScale: 0.5 } } })
        const twoX2 = matBodies.rectangle(580, 550, 25, 20, { isStatic: true, label: "win-twoX", render: { sprite: { texture: x2, xScale: 0.5, yScale: 0.5 } } })
        const onefourX1 = matBodies.rectangle(250, 550, 25, 20, { isStatic: true, label: "win-onefourX", render: { sprite: { texture: x1z4, xScale: 0.5, yScale: 0.5 } } })
        const onefourX2 = matBodies.rectangle(550, 550, 25, 20, { isStatic: true, label: "win-onefourX", render: { sprite: { texture: x1z4, xScale: 0.5, yScale: 0.5 } } })
        const onefourX3 = matBodies.rectangle(280, 550, 25, 20, { isStatic: true, label: "win-onefourX", render: { sprite: { texture: x1z4, xScale: 0.5, yScale: 0.5 } } })
        const onefourX4 = matBodies.rectangle(520, 550, 25, 20, { isStatic: true, label: "win-onefourX", render: { sprite: { texture: x1z4, xScale: 0.5, yScale: 0.5 } } })
        const onetwoX1 = matBodies.rectangle(310, 550, 25, 20, { isStatic: true, label: "win-onetwoX", render: { sprite: { texture: x1z2, xScale: 0.5, yScale: 0.5 } } })
        const onetwoX2 = matBodies.rectangle(490, 550, 25, 20, { isStatic: true, label: "win-onetwoX", render: { sprite: { texture: x1z2, xScale: 0.5, yScale: 0.5 } } })
        const oneoneX1 = matBodies.rectangle(340, 550, 25, 20, { isStatic: true, label: "win-oneoneX", render: { sprite: { texture: x1z1, xScale: 0.5, yScale: 0.5 } } })
        const oneoneX2 = matBodies.rectangle(460, 550, 25, 20, { isStatic: true, label: "win-oneoneX", render: { sprite: { texture: x1z1, xScale: 0.5, yScale: 0.5 } } })
        const oneX1 = matBodies.rectangle(370, 550, 25, 20, { isStatic: true, label: "win-oneX", render: { sprite: { texture: x1, xScale: 0.5, yScale: 0.5 } } })
        const oneX2 = matBodies.rectangle(430, 550, 25, 20, { isStatic: true, label: "win-oneX", render: { sprite: { texture: x1, xScale: 0.5, yScale: 0.5 } } })
        const ofive = matBodies.rectangle(400, 550, 25, 20, { isStatic: true, label: "win-ofiveX", render: { sprite: { texture: x0z5, xScale: 0.5, yScale: 0.5 } } })

        Matter.Events.on(engineRef.current, 'collisionStart', winTouch)

        function winTouch(event: Matter.IEventCollision<Matter.Engine>) {
            event.pairs.forEach((pair) => {
                let ballBody: Matter.Body | null = null;
                let winMultiplierL = "";
        
                if (pair.bodyA.label.startsWith("win") && pair.bodyB.label.startsWith("ball")) {
                    console.log(`WIN: Ball ID ${pair.bodyB.id} NAME: ${pair.bodyB.label} collided with ${pair.bodyA.label}`);
                    ballBody = pair.bodyB;
                    winMultiplierL = pair.bodyA.label;
                } else if (pair.bodyA.label.startsWith("ball") && pair.bodyB.label.startsWith("win")) {
                    console.log(`WIN: Ball ID ${pair.bodyA.id} NAME: ${pair.bodyA.label} collided with ${pair.bodyB.label}`);
                    ballBody = pair.bodyA;
                    winMultiplierL = pair.bodyB.label;

                }
        
                if (ballBody) {
                    const winMultiplier = getMultiplier(winMultiplierL);
                    const winnings = ballBody.plugin.betValue * winMultiplier;
        
                    currentMoneyRef.current += winnings;
                    setMoney(parseFloat(currentMoneyRef.current.toFixed(2)));
        
                    const allBodies = worldRef.current!.bodies;
                    const ballToRemove = allBodies.find((body) => body.id === ballBody!.id);
        
                    if (ballToRemove) {
                        Matter.World.remove(worldRef.current!, ballToRemove);
                        console.log(`Ball ID ${ballToRemove.id} removed successfully`);
                    } else {
                        console.warn(`Ball ID ${ballBody.id} not found in world`);
                    }
                }
            });
        }
        

        function getMultiplier(winLabel: string): number {
            switch(winLabel) {
                case "win-sixteenX":
                    return 16;
                case "win-nineX":
                    return 9;
                case "win-twoX":
                    return 2;
                case "win-onefourX":
                    return 1.4;
                case "win-onetwoX":
                    return 1.2;
                case "win-oneoneX":
                    return 1.1;
                case "win-oneX":
                    return 1;
                case "win-ofiveX":
                    return 0.5;
                default:
                    return 0;
            }
        }

        matWorld.add(world, [
            sixteenX1, sixteenX2,
            nineX1, nineX2,
            twoX1, twoX2,
            onefourX1, onefourX2, onefourX3, onefourX4,
            onetwoX1, onetwoX2,
            oneoneX1, oneoneX2,
            oneX1, oneX2,
            ofive
        ]);

        matRunner.run(runner, engine)
        matRender.run(render)

        return () => {
            matRender.stop(render);
            matWorld.clear(world, false);
            matEngine.clear(engine);
            render.canvas.remove();
        }
    }, [])

    // Ball Logic
    function ball(value: number) {
        return matBodies.circle(400, 10, 8, {
            restitution: 0.5,
            render: {
                fillStyle: "#D70040"
            },
            collisionFilter: {
                group: -1,
            },
            label: `ball-${value}`,
            plugin: { betValue: value },
        })
    }

    function rand(min: number, max:number) {
        return Math.random() * (max - min) + min;
    }

    const dropBall = () => {
        if (engineRef.current && worldRef.current && bet > 0 && bet < currentMoneyRef.current) {
            const dropppedBall = ball(bet)

            currentMoneyRef.current -= bet;
            setMoney(parseFloat(currentMoneyRef.current.toFixed(2)));

            Matter.Body.setVelocity(dropppedBall, {
                x: rand(-0.05, 0.05),
                y: 0
            })

            Matter.Body.setAngularVelocity(dropppedBall, rand(-0.05, 0.05))

            matWorld.add(worldRef.current, dropppedBall);
        } else if (bet === 0) {
            alert("Please add your bet")
        } else {
            alert("Invalid amound of bet")
        }
    }

    return (
        <main className="flex flex-row justify-center items-center min-h-screen bg-primary font-monstserrat font-bold">
            <img src={BackButton} alt="home_button" className="absolute top-4 left-4 w-15 h-15 transition-transform duration-200 hover:scale-110 drop-shadow-[0_0_5px_white] cursor-pointer" onClick={homeButton} />
            <div ref={sceneRef} className="border-1 rounded-xl bg-primary mx-4 shadow-xl shadow-shadowLow"/>
            <div className="flex flex-col justify-between items-center mb-4 p-10 w-100 h-145 bg-secondary rounded-xl">
                <img src={Logo} alt="multiply_logo" />
                <h1 className="text-white text-2xl mb-4">DOLLAHS: ${money}</h1>
                <div className="flex flex-col">
                    <label htmlFor="betAmount" className="mr-2 text-white text-xl">Amount:</label>
                    <input
                        id="betAmount"
                        type="number"
                        value={bet}
                        onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
                        min="0"
                        className="w-50 h-15 text-xl px-2 py-1 border-1 rounded text-white bg-primary"
                    />
                </div>
                <button onClick={dropBall} className="w-50 h-15 ml-4 px-4 py-2 bg-greenbtn text-black text-xl rounded hover:bg-greenbtnHover hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-greenbtn">Play</button>
            </div>
        </main>
    );
};

export default Plinko;
