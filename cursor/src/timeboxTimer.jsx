import React, { useState, useRef, useEffect } from 'react';

function TimeboxTimer({ isDarkMode = false }) {
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

  // Dynamic colors based on dark mode
  const colors = {
    cardBg: isDarkMode ? '#1e293b' : '#fff',
    cardBorder: isDarkMode ? '#334155' : '#e5e7eb',
    textPrimary: isDarkMode ? '#f1f5f9' : '#111827',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280',
    inputBg: isDarkMode ? '#0f172a' : '#f9fafb',
    inputBgDisabled: isDarkMode ? '#334155' : '#f3f4f6',
    inputTextDisabled: isDarkMode ? '#64748b' : '#9ca3af',
    inputBorder: isDarkMode ? '#475569' : '#e5e7eb',
    buttonBg: isDarkMode ? '#3b82f6' : '#111827',
    buttonBgDisabled: isDarkMode ? '#64748b' : '#9ca3af',
    timerBg: isDarkMode ? '#0f172a' : '#f3f4f6',
    timerBorder: isDarkMode ? '#374151' : '#e5e7eb',
  };

  return (
    <div style={{
      background: colors.cardBg,
      borderRadius: '18px',
      boxShadow: isDarkMode 
        ? '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)'
        : '0 4px 24px rgba(0,0,0,0.10)',
      border: `1.5px solid ${colors.cardBorder}`,
      padding: '2.5rem 2.5rem 2rem 2.5rem',
      minWidth: 370,
      maxWidth: 400,
      width: 370,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '1.5rem',
      margin: '0 auto',
      transition: 'all 0.3s ease-in-out',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 28 }}>⏱</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary }}>Timebox Timer</span>
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 16, marginTop: 2 }}>Focus on one task at a time</div>
      </div>
      
      <div>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4, color: colors.textPrimary }}>Task Name</label>
        <input
          type="text"
          placeholder="Record podcast"
          value={task}
          onChange={e => setTask(e.target.value)}
          style={{
            width: '100%',
            marginTop: 0,
            padding: '10px 12px',
            border: `1px solid ${colors.inputBorder}`,
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning ? colors.inputBgDisabled : colors.inputBg,
            color: isRunning ? colors.inputTextDisabled : colors.textPrimary,
            cursor: isRunning ? 'not-allowed' : 'text',
            transition: 'all 0.2s ease-in-out',
          }}
          disabled={isRunning}
        />
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4, color: colors.textPrimary }}>Duration (minutes)</label>
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
            border: `1px solid ${colors.inputBorder}`,
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning ? colors.inputBgDisabled : colors.inputBg,
            color: isRunning ? colors.inputTextDisabled : colors.textPrimary,
            cursor: isRunning ? 'not-allowed' : 'text',
            transition: 'all 0.2s ease-in-out',
          }}
          disabled={isRunning}
        />
        {!isRunning && (
          <button
            style={{
              width: '100%',
              background: colors.buttonBg,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: !task || duration < 1 ? 'not-allowed' : 'pointer',
              marginTop: 4,
              opacity: !task || duration < 1 ? 0.7 : 1,
              transition: 'all 0.2s ease-in-out',
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
          background: colors.timerBg,
          borderRadius: 12,
          padding: '1.5rem 0.5rem',
          marginBottom: 18,
          textAlign: 'center',
          border: `1px solid ${colors.timerBorder}`,
          transition: 'all 0.3s ease-in-out',
        }}>
          <div style={{ color: colors.textSecondary, fontSize: 17, marginBottom: 2 }}>
            Current Task: <span style={{ fontWeight: 600, color: colors.textPrimary }}>{task}</span>
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 1, margin: '8px 0', color: colors.textPrimary }}>{formatTime(timeLeft)}</div>
          <div style={{ color: colors.textSecondary, fontSize: 15 }}>Time remaining</div>
        </div>
      )}

      {isRunning && (
        <button
          style={{
            width: '100%',
            background: colors.buttonBgDisabled,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontSize: 17,
            fontWeight: 600,
            cursor: 'not-allowed',
            marginTop: 4,
            transition: 'all 0.2s ease-in-out',
          }}
          disabled
        >
          ⏰ Timer Running...
        </button>
      )}

      <div style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
        {isRunning ? 'Stay focused on your current task!' : ''}
      </div>
    </div>
  );
}

export default TimeboxTimer; 