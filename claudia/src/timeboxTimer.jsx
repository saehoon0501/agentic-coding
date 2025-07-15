import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import chimeSound from './chime.wav';

function TimeboxTimer({ isDarkMode }) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // localStorage 키
  const STORAGE_KEY = 'timebox-history';

  // localStorage에서 히스토리 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history from localStorage:', error);
      }
    }
  }, []);

  // 히스토리를 localStorage에 저장
  const saveToLocalStorage = (newHistory) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  };

  // 완료된 타임박스를 히스토리에 추가
  const addToHistory = (taskName, durationMinutes, completedAt) => {
    const newTimebox = {
      id: Date.now(),
      task: taskName,
      duration: durationMinutes,
      completedAt: completedAt,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [newTimebox, ...history].slice(0, 5); // 최근 5개만 유지
    setHistory(updatedHistory);
    saveToLocalStorage(updatedHistory);
  };

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsPaused(false);
      
      // 타이머 완료 시 히스토리에 저장
      const completedAt = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      addToHistory(task, duration, completedAt);
      
      // Play chime sound
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
      // Show completion modal
      setShowCompleteModal(true);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, timeLeft, task, duration, history]);

  const handleStart = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setTask('');
    setDuration(45);
  };

  const handleCloseModal = () => {
    setShowCompleteModal(false);
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
          
          {/* Circular Progress Bar */}
          <div style={{ 
            position: 'relative', 
            display: 'inline-block',
            margin: '8px 0'
          }}>
            <svg 
              width="140" 
              height="140" 
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
                zIndex: 1
              }}
            >
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r="65"
                fill="none"
                stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r="65"
                fill="none"
                stroke={isDarkMode ? "#ffffff" : "#111827"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 65}`}
                strokeDashoffset={`${2 * Math.PI * 65 * (1 - (timeLeft / (duration * 60)))}`}
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out'
                }}
              />
            </svg>
            <div className={`
              text-5xl font-bold tracking-wide
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `} style={{ 
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '140px',
              height: '140px'
            }}>
              {formatTime(timeLeft)}
            </div>
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
        <div className="flex gap-3 mt-1">
          <button
            className={`
              flex-1 border-none rounded-lg py-3 text-base font-semibold cursor-pointer transition-colors duration-200
              ${isPaused 
                ? isDarkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                : isDarkMode
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }
            `}
            onClick={handlePause}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            className={`
              flex-1 border-none rounded-lg py-3 text-base font-semibold cursor-pointer transition-colors duration-200
              ${isDarkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
              }
            `}
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        </div>
      )}

      <div className={`
        text-center text-sm min-h-6 transition-colors duration-200
        ${isRunning ? 'mt-2' : 'mt-0'}
        ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {isRunning && isPaused ? 'Timer paused - take a break!' : isRunning ? 'Stay focused on your current task!' : ''}
      </div>

      {/* Hidden audio element for chime sound */}
      <audio ref={audioRef} preload="auto">
        <source src={chimeSound} type="audio/wav" />
      </audio>

      {/* Completion Modal */}
      <Modal
        open={showCompleteModal}
        onClose={handleCloseModal}
        aria-labelledby="timebox-complete-modal"
        aria-describedby="timebox-complete-message"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            outline: 'none',
          }}
        >
          <CheckCircle 
            sx={{ 
              fontSize: 64, 
              color: '#4caf50', 
              mb: 2 
            }} 
          />
          <Typography id="timebox-complete-modal" variant="h5" component="h2" gutterBottom>
            Timebox Complete!
          </Typography>
          <Typography id="timebox-complete-message" sx={{ mb: 3, color: '#6b7280' }}>
            Great job! You've completed your {duration}-minute timebox for "{task}".
          </Typography>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{
              bgcolor: '#111827',
              '&:hover': {
                bgcolor: '#374151',
              },
            }}
          >
            Continue
          </Button>
        </Box>
      </Modal>

      {/* 히스토리 섹션 */}
      {history.length > 0 && (
        <div className={`
          mt-8 p-6 rounded-xl border transition-colors duration-200
          ${isDarkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <h3 className={`
            m-0 mb-4 text-lg font-semibold text-center
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            📊 Recent Timeboxes
          </h3>
          <div className="flex flex-col gap-3">
            {history.map((timebox) => (
              <div key={timebox.id} className={`
                p-3 px-4 rounded-lg border flex justify-between items-center transition-colors duration-200
                ${isDarkMode 
                  ? 'bg-gray-600 border-gray-500' 
                  : 'bg-white border-gray-200'
                }
              `}>
                <div className="flex-1">
                  <div className={`
                    font-medium text-sm mb-0.5
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    {timebox.task}
                  </div>
                  <div className={`
                    text-xs
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  `}>
                    {timebox.completedAt}
                  </div>
                </div>
                <div className={`
                  px-2 py-1 rounded text-xs font-medium text-white
                  ${isDarkMode ? 'bg-green-600' : 'bg-green-500'}
                `}>
                  {timebox.duration}분
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeboxTimer; 