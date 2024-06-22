import { useSelector } from "react-redux";


const Controls = () => {

    const sukuna = useSelector((state: any) => state.SukunaState);

    return (
        <div className="controls">
            <p>Controls: </p>
            <p>W-A-S-D: Movement</p>
            <p>Space: Dash</p>
            <p>K: Call Nue</p> <p> J - Nue Attack</p> <p>L - Call Divine Dogs</p>
            {/* <p>{sukuna.closeRange ? "Close Range" : "Far Range"}</p> */}
        </div>
    )
}
export default Controls;