import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { move, rivalAttacking } from '../store/RivalSlice';
import { healthReducer } from '../store/PlayerSlice';


const Rival = () => {

    const x = 2;
    let y = 4;
    function update(arg) {
        const random = Math.random()
        console.log(random, "+", y, "x", arg)
        return random + y * arg;
    }
    y = 4;
    y = (update(x) - 2) / 2;
    console.log("newY:", y)
    const result = update(x);
    console.log(result)

    const rival = useSelector((state: any) => state.RivalState);
    const player = useSelector((state: any) => state.PlayerState);
    const { isAttacking } = useSelector((state: any) => state.NueState);
    const dispatch = useDispatch();
    const characterWidth = 50;
    const characterHeight = 150;

    const attackInterval = React.useRef(null);

    useEffect(() => {
        setInterval(() => {
            if (rival.x - player.x > 200) {
                dispatch(move({ x: -4, y: 0 }));
            } else if (rival.x - player.x < -200) {
                dispatch(move({ x: +4, y: 0 }));
            }
            if (rival.y - player.y > 50) {
                dispatch(move({ x: 0, y: -4 }));
            } else if (rival.y - player.y < -50) {
                dispatch(move({ x: 0, y: +4 }));
            }
        }, 500);
    }, [player.x]);

    useEffect(() => {
        if (rival.health > 0 && player.health > 0) {
            startAttackInterval();
        } else {
            stopAttackInterval();
        }

        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [rival.health]);
    const startAttackInterval = () => {
        const randomInterval = 2000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            if (player.health > 0) {
                console.log("Rakip saldırıyor");
                dispatch(rivalAttacking(true));
                setTimeout(() => {
                    dispatch(rivalAttacking(false));
                }, 1000)
                dispatch(healthReducer(-10)); // Player'ın canını azalt
            } else {
                stopAttackInterval(); // Player ölünce saldırıyı durdur
            }
        }, randomInterval);
    };
    const stopAttackInterval = () => {
        clearInterval(attackInterval.current);
    };

    return (
        <div className="rival"
            style={{
                top: rival.y, left: rival.x, width: characterWidth, height: characterHeight,
                display: rival.health > 0 ? "block" : "none",
            }}>
            {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
            <img src="sukuna.png" alt="" style={{ height: characterHeight }} />
            <img src="electricity.png" alt="" style={{ display: isAttacking ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />

            <div className="player-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                <div style={{ position: "absolute", width: rival.health * 150 / 100, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -120%)", fontSize: "15px" }}>{rival.health}</p>
            </div>
        </div>
    );
};

export default Rival;
