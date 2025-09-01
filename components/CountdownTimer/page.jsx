import { useState, useEffect } from 'react';


export default function CountdownTimer({ deadline }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(deadline) - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    Object.keys(timeLeft).forEach(interval => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={interval} className="bg-orange-500 text-white px-3 pyy-2 rounded md mx-1">
                {timeLeft[interval]} {interval}
            </span>
        );
    });

    return (
        <div className="bg-orange-100 p-4 rounded-md mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Registration Deadline Countdown</h3>
            {timerComponents.length ? (
                <div className="flex justify-center flex-wrap">
                    {timerComponents}
                </div>
            ) : (
                <span className="text-red-600 font-bold">Registration deadline has passed!</span>
            )}
        </div>
    );
}