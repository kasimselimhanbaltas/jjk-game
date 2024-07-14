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
                <p>Q - Block</p>


                {
                    gameSettings.selectedCharacter === "sukuna" && (
                        <>
                            <p>S - Backflip</p>
                            <p>E - Cleave(Close Range)</p>
                            <p>R - Dismantle</p>
                            <p>F - Fuga(⬜)</p>
                            <p>K - Smash Attack</p>
                            <p>L - Domain Expansion</p>
                        </>

                    )}
                {gameSettings.selectedCharacter === "megumi" && (
                    <>
                        <p>K - Call Nue</p>
                        <p>J - Nue Attack</p>
                        <p>L - Call Divine Dogs</p>
                    </>
                )}
                {gameSettings.selectedCharacter === "gojo" && (
                    <>
                        <p> E - Blue </p>
                        <p> R - Red </p>
                        <p> E + R - Purple </p>
                        <p> J - Punch Combo</p>
                        <p> S + J - Kick Combo</p>
                        <p> K - Black Flash Combo</p>
                        <p> SHIFT + E/R - Charge Skills </p>
                    </>
                )}
            </div>
        </>
    )
}
export default Controls;