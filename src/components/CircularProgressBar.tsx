import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressBar = ({ skillCD }) => {

    const [percentage, setPerncentage] = useState(0)
    const [rotateDegrees, setRotateDegrees] = useState(0)
    // const percentage = (domainCD.remainingTime / domainCD.cooldown) * 100;
    // let rotateDegrees = (percentage / 100) * 360;

    useEffect(() => {
        let localP = (skillCD.remainingTime / skillCD.cooldown) * 100;
        setPerncentage(localP);
        setRotateDegrees((percentage / 100) * 360);
        // console.log("progress: ", skillCD.remainingTime, percentage, rotateDegrees, skillCD)
    }, [skillCD.remainingTime])

    return (
        <div style={{ width: 50, height: 50 }}>
            <CircularProgressbar
                value={100 - percentage}
                text={`${percentage}%`}
                className="circular-skill-progress-bar"
                styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (percentage == 0) ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                })}
            />
        </div>
    );
};

export default CircularProgressBar;
