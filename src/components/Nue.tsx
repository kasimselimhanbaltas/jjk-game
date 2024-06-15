import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveNue, nueActivity, nueAttacking } from "../store/NueSlice";
import { updateRivalHealth } from "../store/RivalSlice";

const Nue = () => {
    const player = useSelector((state: any) => state.PlayerState);
    const rival = useSelector((state: any) => state.RivalState);
    const nue = useSelector((state: any) => state.NueState);
    const dispatch = useDispatch();
    const keysPressed = useRef({ j: false, k: false });

    const gameAreaWidth = 1400;
    const gameAreaHeight = 600;
    const characterWidth = 50;
    const characterHeight = 120;

    function nueAttack() {
        dispatch(moveNue({ x: rival.x, y: rival.y - 100 }))
        dispatch(moveNue({ x: rival.x, y: rival.y - 100 }))

        setTimeout(() => {
            if (rival.x > player.x) {
                dispatch(moveNue({ x: rival.x + 200, y: rival.y - 200 }));
            } else {
                dispatch(moveNue({ x: rival.x - 200, y: rival.y - 200 }));
            }
        }, 250)
        dispatch(nueAttacking(true));
        if (nue.isAttacking) return;
        setTimeout(() => {
            dispatch(updateRivalHealth(-50))
        }, 250)
        setTimeout(() => {
            dispatch(nueAttacking(false));
        }, 1000);
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = true;
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const intervalId = setInterval(() => {

            if (keysPressed.current.j && nue.isAttacking === false) {
                if (nue.isActive === true) {
                    nueAttack();
                }
            }
            if (keysPressed.current.k) {
                if (nue.isActive === true) {
                    dispatch(nueActivity(false));
                } else
                    dispatch(nueActivity(true));
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue.isAttacking, nue]);

    return (
        <div
            className="nue"
            style={{
                display: nue.isActive ? "block" : "none",
                top: nue.isAttacking ? nue.y : player.y - 100,
                left: nue.isAttacking ? nue.x : player.direction === "left" ? player.x + 100 : player.x - 100,
                width: characterWidth,
                height: characterHeight,
            }}>
            {/* <h3>X: {x}</h3>
            <h3>Y: {y}</h3>
            <h3>
                {keysPressed.current.w ? "w" : ""}
                {keysPressed.current.a ? "a" : ""}
                {keysPressed.current.s ? "s" : ""}
                {keysPressed.current.d ? "d" : ""}{direction}
            </h3> */}
            <img src="nue.png" alt="" style={{
                transform: player.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight // Direction'a göre resmi ters çevir
            }} />

        </div>
    );
};

export default Nue;
