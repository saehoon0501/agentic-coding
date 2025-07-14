import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function TimeboxTimer({ isDarkMode = false }) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('timeboxHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Function to play chime sound
  const playChime = () => {
    try {
      // Create a simple chime sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 note
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5 note
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5 note
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio playback not supported:', error);
    }
  };

  // Save completed timebox to localStorage
  const saveCompletedTimebox = useCallback((taskName, durationMinutes) => {
    const completedTimebox = {
      id: Date.now(),
      task: taskName,
      duration: durationMinutes,
      completedAt: new Date().toISOString(),
    };

    const updatedHistory = [completedTimebox, ...history].slice(0, 5); // Keep only last 5
    setHistory(updatedHistory);
    localStorage.setItem('timeboxHistory', JSON.stringify(updatedHistory));
  }, [history]);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsPaused(false);
      playChime();
      setShowCompletionModal(true);
      // Save completed timebox to history when timer reaches zero
      saveCompletedTimebox(task, duration);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, timeLeft, task, duration, saveCompletedTimebox]);

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
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
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

  // Calculate progress for circular progress bar
  const totalSeconds = duration * 60;
  const progress = isRunning ? (timeLeft / totalSeconds) * 100 : 100;
  
  // SVG circle properties
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const CircularProgress = () => (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      margin: '0 auto',
    }}>
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? '#374151' : '#e5e7eb'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress > 20 ? "#3b82f6" : "#ef4444"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease-in-out',
          }}
        />
      </svg>
      {/* Timer content in center */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '140px',
      }}>
        <div style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}>
          {task}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 1, color: colors.textPrimary }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
          remaining
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        margin: '0 auto',
        maxWidth: '600px',
      }}>
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
            <div style={{ display: 'flex', gap: '12px', marginTop: 4 }}>
              <button
                style={{
                  flex: 1,
                  background: isPaused ? '#16a34a' : '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 0',
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={handlePause}
              >
                {isPaused ? '▶ Resume' : '⏸ Pause'}
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
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={handleReset}
              >
                🔄 Reset
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
            {isRunning ? (isPaused ? 'Timer paused - click Resume to continue' : 'Stay focused on your current task!') : ''}
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div style={{
            background: colors.cardBg,
            borderRadius: '18px',
            boxShadow: isDarkMode 
              ? '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)'
              : '0 4px 24px rgba(0,0,0,0.10)',
            border: `1.5px solid ${colors.cardBorder}`,
            padding: '2rem 2.5rem',
            minWidth: 370,
            maxWidth: 400,
            width: 370,
            transition: 'all 0.3s ease-in-out',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: 24 }}>📈</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary }}>Recent Timeboxes</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((timebox) => (
                <div
                  key={timebox.id}
                  style={{
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: 8,
                    padding: '1rem',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <div style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: colors.textPrimary,
                    marginBottom: 4,
                  }}>
                    {timebox.task}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13,
                    color: colors.textSecondary,
                  }}>
                    <span>{timebox.duration} minutes</span>
                    <span>{formatDateTime(timebox.completedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Circular Progress Bar */}
        {isRunning && (
          <div style={{
            background: colors.timerBg,
            borderRadius: 12,
            padding: '2rem 1rem',
            marginBottom: 18,
            textAlign: 'center',
            border: `1px solid ${colors.timerBorder}`,
          }}>
            <CircularProgress />
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <Dialog 
        open={showCompletionModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <CheckCircle sx={{ color: '#4caf50', fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#111827' }}>
              Timebox Complete!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 1 }}>
            Great job! You've completed your timebox session.
          </Typography>
          <Typography variant="body2" sx={{ color: '#111827', fontWeight: 500 }}>
            Task: {task}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Duration: {duration} minutes
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pt: 1 }}>
          <Button 
            onClick={handleCloseModal} 
            variant="contained" 
            sx={{
              bgcolor: '#111827',
              color: '#fff',
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#374151',
              }
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TimeboxTimer; 