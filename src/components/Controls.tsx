import { useSelector } from "react-redux";


const Controls = () => {
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const sukuna = useSelector((state: any) => state.SukunaState);

    return (
        <>
            <div className="controls">
                <p>Controls: </p>
                <p>W-A-S-D: Movement</p>
                <p>Space: Dash</p>
                <p> Q - Block</p>


                {
                    gameSettings.selectedCharacter === "sukuna" && (
                        <>
                            <p>J - Cleave</p>
                            <p> K - Dismantle(Close Range)</p>
                            <p>L - Domain Expansion</p>
                        </>

                    )}
                {gameSettings.selectedCharacter === "megumi" && (
                    <>
                        <p>K: Call Nue</p>
                        <p> J - Nue Attack</p>
                        <p>L - Call Divine Dogs</p>
                    </>
                )}
                {gameSettings.selectedCharacter === "gojo" && (
                    <>
                        <p> Q - Block</p>
                        <p> J - Blue Attack</p>
                        <p> K - Red Attack</p>
                        <p> L - Purple Attack</p>
                        <p>More coming soon...</p>
                    </>
                )}
            </div>
        </>
    )
}
export default Controls;