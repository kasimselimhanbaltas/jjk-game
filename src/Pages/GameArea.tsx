import React from "react";
import Player from "../components/Player";
import Rival from "../components/Rival";
import Nue from "../components/Nue";

const GameArea = () => {
  return (
    <div className="game-area">
      <Player />
      <Nue />
      <Rival />
    </div>
  );
};

export default GameArea;
