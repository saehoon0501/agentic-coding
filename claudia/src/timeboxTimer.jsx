import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import chimeSound from './chime.wav';

function TimeboxTimer() {
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
    <div style={{
      background: '#fff',
      borderRadius: '18px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      border: '1.5px solid #e5e7eb',
      padding: '2.5rem 2.5rem 2rem 2.5rem',
      minWidth: 370,
      maxWidth: 400,
      width: 370,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '1.5rem',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 28 }}>⏱</span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>Timebox Timer</span>
        </div>
        <div style={{ color: '#6b7280', fontSize: 16, marginTop: 2 }}>Focus on one task at a time</div>
      </div>
      
      <div>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>Task Name</label>
        <input
          type="text"
          placeholder="Record podcast"
          value={task}
          onChange={e => setTask(e.target.value)}
          style={{
            width: '100%',
            marginTop: 0,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning ? '#f3f4f6' : '#f9fafb',
            color: isRunning ? '#9ca3af' : '#111827',
            cursor: isRunning ? 'not-allowed' : 'text',
          }}
          disabled={isRunning}
        />
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>Duration (minutes)</label>
        <input
          type="number"
          min={1}
          placeholder="45"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          style={{
            width: '100%',
            marginTop: 0,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning ? '#f3f4f6' : '#f9fafb',
            color: isRunning ? '#9ca3af' : '#111827',
            cursor: isRunning ? 'not-allowed' : 'text',
          }}
          disabled={isRunning}
        />
        {!isRunning && (
          <button
            style={{
              width: '100%',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: !task || duration < 1 ? 'not-allowed' : 'pointer',
              marginTop: 4,
              opacity: !task || duration < 1 ? 0.7 : 1,
            }}
            onClick={handleStart}
            disabled={!task || duration < 1}
          >
            ▶ Start Timer
          </button>
        )}
      </div>

      {isRunning && (
        <div style={{
          background: '#f3f4f6',
          borderRadius: 12,
          padding: '1.5rem 0.5rem',
          marginBottom: 18,
          textAlign: 'center',
          border: '1px solid #e5e7eb',
          position: 'relative',
        }}>
          <div style={{ color: '#6b7280', fontSize: 17, marginBottom: 2 }}>
            Current Task: <span style={{ fontWeight: 600, color: '#111827' }}>{task}</span>
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
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r="65"
                fill="none"
                stroke="#111827"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 65}`}
                strokeDashoffset={`${2 * Math.PI * 65 * (1 - (timeLeft / (duration * 60)))}`}
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out'
                }}
              />
            </svg>
            <div style={{ 
              fontSize: 44, 
              fontWeight: 700, 
              letterSpacing: 1,
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
          
          <div style={{ color: '#6b7280', fontSize: 15 }}>Time remaining</div>
        </div>
      )}

      {isRunning && (
        <div style={{ display: 'flex', gap: '12px', marginTop: 4 }}>
          <button
            style={{
              flex: 1,
              background: isPaused ? '#10b981' : '#f59e0b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={handlePause}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            style={{
              flex: 1,
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
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
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            textAlign: 'center'
          }}>
            📊 Recent Timeboxes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((timebox) => (
              <div key={timebox.id} style={{
                background: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '500',
                    color: '#111827',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    {timebox.task}
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '12px'
                  }}>
                    {timebox.completedAt}
                  </div>
                </div>
                <div style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
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