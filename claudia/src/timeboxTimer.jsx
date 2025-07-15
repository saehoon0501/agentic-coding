import React, { useState, useRef, useEffect } from 'react';

function TimeboxTimer({ isDarkMode }) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={`
      ${isDarkMode 
        ? 'bg-gray-800 border-gray-600 shadow-2xl' 
        : 'bg-white border-gray-200 shadow-lg'
      }
      rounded-2xl border-2 p-10 pb-8 min-w-96 max-w-96 w-96 
      flex flex-col gap-6 mx-auto transition-all duration-200
    `}>
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-3xl">⏱</span>
          <span className={`
            text-3xl font-bold 
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            Timebox Timer
          </span>
        </div>
        <div className={`
          text-base mt-1
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
        `}>
          Focus on one task at a time
        </div>
      </div>
      
      <div>
        <label className={`
          font-medium text-sm block mb-1
          ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}
        `}>
          Task Name
        </label>
        <input
          type="text"
          placeholder="Record podcast"
          value={task}
          onChange={e => setTask(e.target.value)}
          className={`
            w-full p-3 rounded-lg text-sm outline-none mb-4 transition-colors duration-200
            ${isRunning 
              ? isDarkMode 
                ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              : isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:border-gray-500'
                : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-gray-400'
            }
            border
          `}
          disabled={isRunning}
        />
        <label className={`
          font-medium text-sm block mb-1
          ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}
        `}>
          Duration (minutes)
        </label>
        <input
          type="number"
          min={1}
          placeholder="45"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className={`
            w-full p-3 rounded-lg text-sm outline-none mb-4 transition-colors duration-200
            ${isRunning 
              ? isDarkMode 
                ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              : isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:border-gray-500'
                : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-gray-400'
            }
            border
          `}
          disabled={isRunning}
        />
        {!isRunning && (
          <button
            className={`
              w-full border-none rounded-lg py-3 text-base font-semibold mt-1 transition-all duration-200
              ${!task || duration < 1
                ? isDarkMode 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-70'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                : isDarkMode
                  ? 'bg-white text-gray-900 hover:bg-gray-100 cursor-pointer'
                  : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
              }
            `}
            onClick={handleStart}
            disabled={!task || duration < 1}
          >
            ▶ Start Timer
          </button>
        )}
      </div>

      {isRunning && (
        <div className={`
          ${isDarkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-100 border-gray-200'
          }
          rounded-xl p-6 py-6 mb-4 text-center border transition-colors duration-200
        `}>
          <div className={`
            text-base mb-1
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            Current Task: <span className={`
              font-semibold 
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>{task}</span>
          </div>
          <div className={`
            text-5xl font-bold tracking-wide my-2
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            {formatTime(timeLeft)}
          </div>
          <div className={`
            text-sm
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Time remaining
          </div>
        </div>
      )}

      {isRunning && (
        <button
          className={`
            w-full border-none rounded-lg py-3 text-base font-semibold mt-1 cursor-not-allowed
            ${isDarkMode 
              ? 'bg-gray-600 text-gray-300' 
              : 'bg-gray-400 text-white'
            }
          `}
          disabled
        >
          ⏰ Timer Running...
        </button>
      )}

      <div className={`
        text-center text-sm min-h-6 transition-colors duration-200
        ${isRunning ? 'mt-2' : 'mt-0'}
        ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {isRunning ? 'Stay focused on your current task!' : ''}
      </div>
    </div>
  );
}

export default TimeboxTimer; 