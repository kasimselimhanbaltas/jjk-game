import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlayerState from "../store/GlobalStore"
import { move } from '../store/PlayerSlice';
import { deprecate } from 'util';
import { start } from 'repl';

const Player = () => {
    const { x, y } = useSelector((state: any) => state.PlayerState);
    const dispatch = useDispatch();
    const [wPressed, setWPressed] = useState(false);
    const [aPressed, setAPressed] = useState(false);
    const [sPressed, setSPressed] = useState(false);
    const [dPressed, setDPressed] = useState(false);


    const handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        if (key === 'w') {
            setWPressed(true);
        } if (key === 'a') {
            setAPressed(true);
        } if (key === 's') {
            setSPressed(true);
        } if (key === 'd') {
            setDPressed(true);
        }
    };

    const handleKeyUp = (event) => {
        const key = event.key.toLowerCase();
        if (key == 'w') {
            setWPressed(false);
        } if (key == 'a') {
            setAPressed(false);
        } if (key == 's') {
            setSPressed(false);
        } if (key == 'd') {
            setDPressed(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            // console.log("Game is on!", wPressed, aPressed, sPressed, dPressed);
            if (wPressed) {
                dispatch(move({ x: 0, y: -10 }));
            }
            if (aPressed) {
                dispatch(move({ x: -10, y: 0 }));
            }
            if (sPressed) {
                dispatch(move({ x: 0, y: +10 }));
            }
            if (dPressed) {
                dispatch(move({ x: +10, y: 0 }));
            }
        }, 50);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount or when dependencies change
    }, [wPressed, aPressed, sPressed, dPressed]);


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {

    }, [wPressed, aPressed, sPressed, dPressed]); // Run this effect whenever wPressed changes


    return (
        <div className="player"
            style={{ top: y, left: x }}
        >
            <h3>X: {x}</h3>
            <h3>Y: {y}</h3>
            <h3>{wPressed ? "w" : ""}{aPressed ? "a" : ""}{sPressed ? "s" : ""}{dPressed ? "d" : ""} </h3>
            {/* <img src="megumi.png" alt="" /> */}

        </div>
    );
};

export default Player;
