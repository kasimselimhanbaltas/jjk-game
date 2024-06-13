import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { move } from '../store/RivalSlice';


const Rival = () => {

    const { x, y, health } = useSelector((state: any) => state.RivalState);
    const { isAttacking } = useSelector((state: any) => state.NueState);
    const dispatch = useDispatch();
    const characterWidth = 50;
    const characterHeight = 200;

    return (
        <div className="rival"
            style={{ top: y, left: x, width: characterWidth, height: characterHeight }}>
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
