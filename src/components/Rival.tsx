import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { moveRival, rivalAttacking, rivalDirection } from '../store/RivalSlice';
import { healthReducer } from '../store/PlayerSlice';


const Rival = ({ xDistance }) => {

    const dispatch = useDispatch();
    const rival = useSelector((state: any) => state.RivalState);
    const player = useSelector((state: any) => state.PlayerState);
    const { isAttacking } = useSelector((state: any) => state.NueState);
    const characterWidth = 50;
    const characterHeight = 150;
    const attackDamage = rival.closeRange ? -500 : -10; // Saldırı hasarı

    const attackInterval = React.useRef(null);


    // useEffect(() => {
    //     console.log("RIVALDIRECTION IN EFFECT", rival.rivalDirection)
    //     const intervalId = setInterval(() => {
    //         if (rival.rivalDirection == "left") {
    //             dispatch(moveRival({ x: -10, y: 0 }));
    //         } else if (rival.rivalDirection == "right") {
    //             dispatch(moveRival({ x: +10, y: 0 }));
    //         }
    //         if (rival.y - player.y > 50) {
    //             dispatch(moveRival({ x: 0, y: -10 }));
    //         } else if (rival.y - player.y < -50) {
    //             dispatch(moveRival({ x: 0, y: +10 }));
    //         }
    //     }, 100);
    // }, [rival.rivalDirection]);

    useEffect(() => {
        if (rival.health > 0 && player.health > 0) {
            startAttackInterval();
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [dispatch, attackDamage, rival.rivalDirection]);

    useEffect(() => {
        if (xDistance > 200) {
            dispatch(rivalDirection(rival.rivalDirection));
        }

    }, [xDistance]);

    const startAttackInterval = () => {
        const randomInterval = 2000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            if (player.health > 0) {
                dispatch(rivalAttacking(true));
                setTimeout(() => {
                    dispatch(rivalAttacking(false));
                }, 1000)
                dispatch(healthReducer(attackDamage)); // Player'ın canını azalt
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
            <p style={{ position: "absolute", top: "50%", left: "-50%", transform: "translate(-50%, -50%)", fontSize: "15px" }}>
                Rival Direction: {rival.rivalDirection} <br /> Range: {rival.closeRange ? "Close Range" : "Far Range"} <br /> Distance: {xDistance}
            </p>
        </div>
    );
};

export default Rival;
