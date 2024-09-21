

const ControlsPage = () => {

    return (
        <div>
            <div className="controls-page">
                <div className="controls-text">
                    <>
                        <img src={require("../Assets/controls-gojo.png")} alt="" />
                    </>
                </div>
                <p style={{
                    position: "absolute", bottom: 0, right: 200, 
                }}>Press ESC to close...</p>
            </div>
        </div>
    )
}
export default ControlsPage;