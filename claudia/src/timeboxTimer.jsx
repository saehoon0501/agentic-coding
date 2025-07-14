import React, { useState, useRef, useEffect } from 'react';
import { Pause, PlayArrow, Refresh, History } from '@mui/icons-material';

function TimeboxTimer() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeboxHistory, setTimeboxHistory] = useState([]);
  const intervalRef = useRef(null);

  // localStorage에서 히스토리 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem('timeboxHistory');
    if (savedHistory) {
      setTimeboxHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 완료된 타임박스를 localStorage에 저장
  const saveCompletedTimebox = (taskName, durationMinutes) => {
    const completedTimebox = {
      id: Date.now(),
      taskName,
      duration: durationMinutes,
      completedAt: new Date().toISOString(),
      completedAtFormatted: new Date().toLocaleString()
    };
    
    const updatedHistory = [completedTimebox, ...timeboxHistory].slice(0, 5);
    setTimeboxHistory(updatedHistory);
    localStorage.setItem('timeboxHistory', JSON.stringify(updatedHistory));
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
      // 타이머 완료 시 localStorage에 저장
      saveCompletedTimebox(task, duration);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, timeLeft, task, duration]);

  const handleStart = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
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
        }}>
          <div style={{ color: '#6b7280', fontSize: 17, marginBottom: 2 }}>
            Current Task: <span style={{ fontWeight: 600, color: '#111827' }}>{task}</span>
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 1, margin: '8px 0' }}>{formatTime(timeLeft)}</div>
          <div style={{ color: '#6b7280', fontSize: 15 }}>Time remaining</div>
        </div>
      )}

      {isRunning && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 4 }}>
          <button
            style={{
              flex: 1,
              background: isPaused ? '#059669' : '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onClick={isPaused ? handleResume : handlePause}
          >
            {isPaused ? <PlayArrow /> : <Pause />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            style={{
              flex: 1,
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onClick={handleReset}
          >
            <Refresh />
            Reset
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
        {isRunning ? (isPaused ? 'Timer paused. Click Resume to continue.' : 'Stay focused on your current task!') : ''}
      </div>

      {/* 히스토리 섹션 */}
      {timeboxHistory.length > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: '#374151',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            <History style={{ fontSize: '20px' }} />
            Recent Timeboxes
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {timeboxHistory.map((timebox) => (
              <div
                key={timebox.id}
                style={{
                  background: '#fff',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '2px'
                  }}>
                    {timebox.taskName}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {timebox.completedAtFormatted}
                  </div>
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '4px 8px',
                  borderRadius: '6px'
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