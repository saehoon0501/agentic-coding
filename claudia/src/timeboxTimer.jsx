import React, { useState, useRef, useEffect } from 'react';

function TimeboxTimer() {
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
        <button
          style={{
            width: '100%',
            background: '#9ca3af',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontSize: 17,
            fontWeight: 600,
            cursor: 'not-allowed',
            marginTop: 4,
          }}
          disabled
        >
          ⏰ Timer Running...
        </button>
      )}

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
        {isRunning ? 'Stay focused on your current task!' : ''}
      </div>
    </div>
  );
}

export default TimeboxTimer; 