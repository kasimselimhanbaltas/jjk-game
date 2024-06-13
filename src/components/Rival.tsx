import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { move, rivalAttacking } from '../store/RivalSlice';
import { healthReducer } from '../store/PlayerSlice';


const Rival = () => {

    const { x, y, health } = useSelector((state: any) => state.RivalState);
    const player = useSelector((state: any) => state.PlayerState);
    const { isAttacking } = useSelector((state: any) => state.NueState);
    const dispatch = useDispatch();
    const characterWidth = 50;
    const characterHeight = 200;

    const attackInterval = React.useRef(null);

    useEffect(() => {
        if (health > 0 && player.health > 0) {
            startAttackInterval();
        } else {
            stopAttackInterval();
        }

        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };
    }, [health]);
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
                top: y, left: x, width: characterWidth, height: characterHeight,
                display: health > 0 ? "block" : "none",
            }}>
            {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
            <img src="sukuna.png" alt="" style={{ height: characterHeight }} />
            <img src="electricity.png" alt="" style={{ display: isAttacking ? "block" : "none", height: characterHeight, width: "150px", opacity: 0.8 }} />

            <div className="player-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                <div style={{ position: "absolute", width: health * 150 / 100, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -120%)", fontSize: "15px" }}>{health}</p>
            </div>
        </div>
    );
};

export default Rival;
