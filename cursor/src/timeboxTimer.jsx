import React, { useState, useRef, useEffect } from 'react';

function TimeboxTimer() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('timeboxHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save completed timebox to localStorage
  const saveCompletedTimebox = (taskName, durationMinutes) => {
    const completedTimebox = {
      id: Date.now(),
      task: taskName,
      duration: durationMinutes,
      completedAt: new Date().toISOString(),
    };

    const updatedHistory = [completedTimebox, ...history].slice(0, 5); // Keep only last 5
    setHistory(updatedHistory);
    localStorage.setItem('timeboxHistory', JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      // Save completed timebox to history when timer reaches zero
      saveCompletedTimebox(task, duration);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, task, duration, history]);

  const handleStart = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      margin: '0 auto',
      maxWidth: '600px',
    }}>
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

      {/* History Section */}
      {history.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          border: '1.5px solid #e5e7eb',
          padding: '2rem 2.5rem',
          minWidth: 370,
          maxWidth: 400,
          width: 370,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: 24 }}>📈</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>Recent Timeboxes</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((timebox) => (
              <div
                key={timebox.id}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: '1rem',
                }}
              >
                <div style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#111827',
                  marginBottom: 4,
                }}>
                  {timebox.task}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  color: '#6b7280',
                }}>
                  <span>{timebox.duration} minutes</span>
                  <span>{formatDateTime(timebox.completedAt)}</span>
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