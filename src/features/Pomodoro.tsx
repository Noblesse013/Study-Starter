// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { notify, requestPerm } from './nativeNotify';

interface PomodoroProps {
  onWorkComplete?: () => void;
}

type Phase = 'work' | 'break';

const Pomodoro: React.FC<PomodoroProps> = (props: PomodoroProps) => {
  const { onWorkComplete } = props;
  const [workMinutes, setWorkMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro_work');
    return saved ? Number(saved) : 25;
  });
  const [breakMinutes, setBreakMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro_break');
    return saved ? Number(saved) : 5;
  });
  const [phase, setPhase] = useState<Phase>(() => (localStorage.getItem('pomodoro_phase') as Phase) || 'work');
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro_seconds');
    if (saved) return Number(saved);
    return (phase === 'work' ? workMinutes : breakMinutes) * 60;
  });
  const [running, setRunning] = useState<boolean>(() => localStorage.getItem('pomodoro_running') === '1');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('pomodoro_work', String(workMinutes));
  }, [workMinutes]);

  useEffect(() => {
    localStorage.setItem('pomodoro_break', String(breakMinutes));
  }, [breakMinutes]);

  useEffect(() => {
    localStorage.setItem('pomodoro_phase', phase);
  }, [phase]);

  useEffect(() => {
    localStorage.setItem('pomodoro_seconds', String(secondsLeft));
  }, [secondsLeft]);

  useEffect(() => {
    localStorage.setItem('pomodoro_running', running ? '1' : '0');
  }, [running]);

  useEffect(() => {
    // ask once on mount
    requestPerm().catch(() => {});
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev: number) => {
        if (prev <= 1) {
          const nextPhase: Phase = phase === 'work' ? 'break' : 'work';
          if (phase === 'work' && onWorkComplete) onWorkComplete();
          if (phase === 'work') notify('Focus complete', 'Time for a break!');
          setPhase(nextPhase);
          return (nextPhase === 'work' ? workMinutes : breakMinutes) * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, phase, workMinutes, breakMinutes, onWorkComplete]);

  const formatTime = (n: number) => {
    const m = Math.floor(n / 60).toString().padStart(2, '0');
    const s = Math.floor(n % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const reset = () => {
    setPhase('work');
    setSecondsLeft(workMinutes * 60);
    setRunning(false);
  };

  const skip = () => {
    const next: Phase = phase === 'work' ? 'break' : 'work';
    if (phase === 'work' && onWorkComplete) onWorkComplete();
    // Notification on complete
    try {
      if ('Notification' in window && Notification.permission === 'granted' && phase === 'work') {
        new Notification('Focus complete', { body: 'Time for a break!' });
      }
    } catch {}
    setPhase(next);
    setSecondsLeft((next === 'work' ? workMinutes : breakMinutes) * 60);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setPhase('work')}
          className={`px-3 py-1 rounded ${phase === 'work' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Work
        </button>
        <button
          onClick={() => setPhase('break')}
          className={`px-3 py-1 rounded ${phase === 'break' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Break
        </button>
      </div>
      <div className="text-6xl font-bold text-center text-indigo-700 mb-4">{formatTime(secondsLeft)}</div>
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setRunning((r: boolean) => !r)}
          className={`px-4 py-2 rounded ${running ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}`}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded bg-gray-100 text-gray-700">Reset</button>
        <button onClick={skip} className="px-4 py-2 rounded bg-purple-100 text-purple-700">Skip</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Work minutes</p>
          <input
            type="number"
            min={1}
            max={120}
            value={workMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkMinutes(Math.max(1, Math.min(120, Number(e.target.value))))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Break minutes</p>
          <input
            type="number"
            min={1}
            max={60}
            value={breakMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBreakMinutes(Math.max(1, Math.min(60, Number(e.target.value))))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;


