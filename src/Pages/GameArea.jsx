import React from "react";
import Player from "../components/Player";
import Rival from "../components/Rival";

const GameArea = () => {
  return (
    <div className="game-area">
      <Player />
      <Rival />
    </div>
  );
};

export default GameArea;
