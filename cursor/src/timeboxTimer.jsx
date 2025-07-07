import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function TimeboxTimer() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      playChime();
      setShowCompletionModal(true);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
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