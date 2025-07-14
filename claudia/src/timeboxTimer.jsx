import React, { useState, useRef, useEffect } from 'react';
import { Pause, PlayArrow, Refresh, History } from '@mui/icons-material';
import { Modal, Box, Typography, Button, useTheme } from '@mui/material';

function TimeboxTimer() {
  const theme = useTheme();
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeboxHistory, setTimeboxHistory] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
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
      // 치임 소리 재생 및 모달 표시
      playChimeSound();
      setShowCompletionModal(true);
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

  const playChimeSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 치임 소리 패턴 (800Hz -> 600Hz -> 800Hz)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio playback not supported or failed:', error);
    }
  };

  const handleModalClose = () => {
    setShowCompletionModal(false);
  };

  const modalStyle = {
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
  };

  return (
    <div style={{
      background: theme.palette.background.paper,
      borderRadius: '18px',
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 4px 24px rgba(0,0,0,0.25)' 
        : '0 4px 24px rgba(0,0,0,0.10)',
      border: `1.5px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
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
          <span style={{ 
            fontSize: 28, 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}>Timebox Timer</span>
        </div>
        <div style={{ 
          color: theme.palette.text.secondary, 
          fontSize: 16, 
          marginTop: 2 
        }}>Focus on one task at a time</div>
      </div>
      
      <div>
        <label style={{ 
          fontWeight: 500, 
          fontSize: 15, 
          display: 'block', 
          marginBottom: 4,
          color: theme.palette.text.primary
        }}>Task Name</label>
        <input
          type="text"
          placeholder="Record podcast"
          value={task}
          onChange={e => setTask(e.target.value)}
          style={{
            width: '100%',
            marginTop: 0,
            padding: '10px 12px',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning 
              ? (theme.palette.mode === 'dark' ? '#1f2937' : '#f3f4f6')
              : (theme.palette.mode === 'dark' ? '#111827' : '#f9fafb'),
            color: isRunning 
              ? theme.palette.text.disabled 
              : theme.palette.text.primary,
            cursor: isRunning ? 'not-allowed' : 'text',
          }}
          disabled={isRunning}
        />
        <label style={{ 
          fontWeight: 500, 
          fontSize: 15, 
          display: 'block', 
          marginBottom: 4,
          color: theme.palette.text.primary
        }}>Duration (minutes)</label>
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
            border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning 
              ? (theme.palette.mode === 'dark' ? '#1f2937' : '#f3f4f6')
              : (theme.palette.mode === 'dark' ? '#111827' : '#f9fafb'),
            color: isRunning 
              ? theme.palette.text.disabled 
              : theme.palette.text.primary,
            cursor: isRunning ? 'not-allowed' : 'text',
          }}
          disabled={isRunning}
        />
        {!isRunning && (
          <button
            style={{
              width: '100%',
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
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
          background: theme.palette.mode === 'dark' ? '#1f2937' : '#f3f4f6',
          borderRadius: 12,
          padding: '1.5rem 0.5rem',
          marginBottom: 18,
          textAlign: 'center',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        }}>
          <div style={{ 
            color: theme.palette.text.secondary, 
            fontSize: 17, 
            marginBottom: 2 
          }}>
            Current Task: <span style={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary 
            }}>{task}</span>
          </div>
          <div style={{ 
            fontSize: 44, 
            fontWeight: 700, 
            letterSpacing: 1, 
            margin: '8px 0',
            color: theme.palette.text.primary
          }}>{formatTime(timeLeft)}</div>
          <div style={{ 
            color: theme.palette.text.secondary, 
            fontSize: 15 
          }}>Time remaining</div>
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

      <div style={{ 
        textAlign: 'center', 
        color: theme.palette.text.secondary, 
        fontSize: 15, 
        marginTop: isRunning ? 8 : 0, 
        minHeight: 24 
      }}>
        {isRunning ? (isPaused ? 'Timer paused. Click Resume to continue.' : 'Stay focused on your current task!') : ''}
      </div>

      {/* 히스토리 섹션 */}
      {timeboxHistory.length > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: theme.palette.mode === 'dark' ? '#1f2937' : '#f9fafb',
          borderRadius: '12px',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: theme.palette.text.primary,
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
                  background: theme.palette.mode === 'dark' ? '#111827' : '#fff',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.palette.text.primary,
                    marginBottom: '2px'
                  }}>
                    {timebox.taskName}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: theme.palette.text.secondary
                  }}>
                    {timebox.completedAtFormatted}
                  </div>
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#059669',
                  background: theme.palette.mode === 'dark' ? '#064e3b' : '#ecfdf5',
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

      {/* 타이머 완료 모달 */}
      <Modal
        open={showCompletionModal}
        onClose={handleModalClose}
        aria-labelledby="timebox-complete-modal"
        aria-describedby="timebox-completion-message"
      >
        <Box sx={modalStyle}>
          <Typography id="timebox-complete-modal" variant="h4" component="h2" gutterBottom>
            🎉 Timebox Complete!
          </Typography>
          <Typography id="timebox-completion-message" sx={{ mt: 2, mb: 3 }}>
            Great job! You've completed your timebox for:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            {task}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Duration: {duration} minutes
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleModalClose}
            sx={{ mt: 2 }}
          >
            Got it!
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default TimeboxTimer; 