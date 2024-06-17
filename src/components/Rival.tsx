import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { moveRival, rivalAttacking, setRapidAttack, setRivalDirection } from '../store/RivalSlice';
import { healthReducer } from '../store/PlayerSlice';


const Rival = ({ xDistance }) => {

    const dispatch = useDispatch();
    const rival = useSelector((state: any) => state.RivalState);
    const player = useSelector((state: any) => state.PlayerState);
    const nue = useSelector((state: any) => state.NueState);
    const { isAttacking } = useSelector((state: any) => state.NueState);
    const characterWidth = 50;
    const characterHeight = 150;
    const attackDamage = rival.closeRange ? -100 : -10; // Saldırı hasarı
    const [electricityEffect, setElectricityEffect] = React.useState(false);
    const [rapidAttackCounter, setRapidAttackCounter] = React.useState(5);

    const attackInterval = React.useRef(null);

    // Nue elecetric image animation
    useEffect(() => {
        if (!nue.isAttacking) return
        setTimeout(() => {
            setElectricityEffect(true)
            setTimeout(() => {
                setElectricityEffect(false)
            }, 2000);
        }, 500);
    }, [nue.isAttacking]);

    // Rival auto attack starter
    useEffect(() => {
        if (rival.health > 0 && player.health > 0) {
            startAttackInterval();
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [dispatch, attackDamage, rival.direction, rival.canMove, rapidAttackCounter]);


    const startAttackInterval = () => {
        const randomInterval = 2000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            if (player.health > 0 && rival.health > 0) {
                // if (player.health > 0 && rival.health > 0 && rival.canMove) {
                if (rapidAttackCounter === 0) {
                    setRapidAttackCounter(5);
                    dispatch(setRapidAttack(true));
                    setTimeout(() => {
                        dispatch(setRapidAttack(false));
                    }, 1000);
                } else {
                    setRapidAttackCounter(rapidAttackCounter - 1);
                    dispatch(rivalAttacking(true));
                    setTimeout(() => {
                        dispatch(rivalAttacking(false));
                    }, 1000)
                    dispatch(healthReducer(attackDamage)); // Player'ın canını azalt
                }
            } else {
                stopAttackInterval(); // Player ölünce saldırıyı durdur
            }
        }, randomInterval);
    };
    const stopAttackInterval = () => {
        clearInterval(attackInterval.current);
    };

    useEffect(() => {
        if (rival.health <= 0)
            stopAttackInterval();
    }, [rival.health]);

    return (
        <div className="rival"
            style={{
                top: rival.y, left: rival.x, width: characterWidth, height: characterHeight,
                display: rival.health > 0 ? "block" : "none",
            }}>
            {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
            <img src={require('../Assets/sukuna.png')} alt="" style={{ height: characterHeight }} />
            <img src={require('../Assets/electricity.png')} alt="" style={{ display: electricityEffect ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />

            <div className="player-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                <div style={{ position: "absolute", width: rival.health * 150 / 100, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -120%)", fontSize: "15px" }}>{rival.health}</p>
            </div>
            {/* <p style={{ position: "absolute", top: "50%", left: "-50%", transform: "translate(-50%, -50%)", fontSize: "15px" }}>
                Rival Direction: {rival.direction} <br /> Range: {rival.closeRange ? "Close Range" : "Far Range"} <br /> Distance: {xDistance}
            </p> */}
            <p style={{ marginTop: 170, width: 250, marginLeft: -55, color: "black" }}>Ryomen Sukuna</p>
        </div>
    );
};

export default Rival;
