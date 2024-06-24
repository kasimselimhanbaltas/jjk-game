import { useSelector } from "react-redux";


const Controls = () => {
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const sukuna = useSelector((state: any) => state.SukunaState);

    return (
        <>
            {
                gameSettings.selectedCharacter === "sukuna" && (
                    <div className="controls">
                        <p>Controls: </p>
                        <p>W-A-S-D: Movement</p>
                        <p>Space: Dash</p>
                        <p>J - Cleave</p> <p> K - Dismantle(Close Range)</p> <p>L - Domain Expansion</p>
                        {/* <p>{sukuna.closeRange ? "Close Range" : "Far Range"}</p> */}
                    </div>

                )}
            {gameSettings.selectedCharacter === "megumi" && (
                <div className="controls">
                    <p>Controls: </p>
                    <p>W-A-S-D: Movement</p>
                    <p>Space: Dash</p>
                    <p>K: Call Nue</p> <p> J - Nue Attack</p> <p>L - Call Divine Dogs</p>
                    {/* <p>{sukuna.closeRange ? "Close Range" : "Far Range"}</p> */}
                </div>
            )}
        </>
    )
}
export default Controls;