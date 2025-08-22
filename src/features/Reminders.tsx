import React, { useEffect, useMemo, useState } from 'react';
import { notify, requestPerm } from './nativeNotify';

interface Reminder { id: string; title: string; dueAt: string }

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState('');

  useEffect(() => { localStorage.setItem('reminders', JSON.stringify(reminders)); }, [reminders]);

  useEffect(() => { requestPerm().catch(() => {}); }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      setReminders(prev => prev.map(r => {
        const due = new Date(r.dueAt).getTime();
        // Notify if within last 5 seconds window
        if (due <= now && due > now - 6000) { notify('Reminder', r.title); }
        return r;
      }));
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const addReminder = () => {
    if (!title.trim() || !dueAt) return;
    setReminders(prev => [...prev, { id: Date.now().toString(), title, dueAt }]);
    setTitle(''); setDueAt('');
  };

  const removeReminder = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));

  const upcoming = useMemo(() => reminders.slice().sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()), [reminders]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Title</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <p className="text-sm text-gray-600 mb-2">Due at</p>
          <input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <button onClick={addReminder} className="px-4 py-2 rounded bg-indigo-600 text-white">Add Reminder</button>
        </div>
        <div className="bg-white border rounded p-4">
          <p className="text-sm text-gray-600 mb-2">Upcoming</p>
          <ul className="space-y-2 max-h-64 overflow-auto">
            {upcoming.map(r => (
              <li key={r.id} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">{new Date(r.dueAt).toLocaleString()}</div>
                </div>
                <button onClick={() => removeReminder(r.id)} className="text-red-600 text-sm">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reminders;


