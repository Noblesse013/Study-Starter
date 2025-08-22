import React, { useEffect, useMemo, useState } from 'react';

interface CourseRef { id: string; code: string; topic: string }
interface Flashcard { id: string; front: string; back: string }

interface FlashcardsProps {
  courses: CourseRef[];
  awardXp: (amount: number) => void;
}

type FlashByCourse = Record<string, Flashcard[]>;

const Flashcards: React.FC<FlashcardsProps> = ({ courses, awardXp }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => localStorage.getItem('fc_selected_course') || courses[0]?.id || '');
  const [cardsByCourse, setCardsByCourse] = useState<FlashByCourse>(() => {
    const saved = localStorage.getItem('flashcards_by_course');
    return saved ? JSON.parse(saved) : {};
  });

  const cards = cardsByCourse[selectedCourseId] || [];
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);
  const [showBack, setShowBack] = useState(false);

  // AI generation state
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { localStorage.setItem('fc_selected_course', selectedCourseId); }, [selectedCourseId]);
  useEffect(() => { localStorage.setItem('flashcards_by_course', JSON.stringify(cardsByCourse)); }, [cardsByCourse]);

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    const newCard: Flashcard = { id: Date.now().toString(), front, back };
    setCardsByCourse(prev => ({ ...prev, [selectedCourseId]: [...(prev[selectedCourseId] || []), newCard] }));
    setFront(''); setBack('');
  };

  const removeCard = (id: string) => {
    setCardsByCourse(prev => ({ ...prev, [selectedCourseId]: (prev[selectedCourseId] || []).filter(c => c.id !== id) }));
  };

  const startPractice = () => {
    if (cards.length === 0) return;
    setPracticeIndex(0);
    setShowBack(false);
  };

  const nextCard = () => {
    if (practiceIndex === null) return;
    const next = practiceIndex + 1;
    if (next >= cards.length) {
      setPracticeIndex(null);
      setShowBack(false);
      return;
    }
    setPracticeIndex(next);
    setShowBack(false);
  };

  const iGotIt = () => {
    awardXp(5);
    nextCard();
  };

  const current = practiceIndex !== null ? cards[practiceIndex] : null;

  const generateFromText = async (text: string) => {
    if (!apiKey) {
      alert('Missing API key. Add VITE_GEMINI_API_KEY to your .env file and restart.');
      return;
    }
    setGenerating(true);
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: 'Create concise study flashcards as JSON array of objects with front and back fields from the following content. Return ONLY JSON, no extra text. Content:\n' + text }]
          }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
        })
      });
      const data = await resp.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Attempt to parse JSON from model output
      const start = raw.indexOf('[');
      const end = raw.lastIndexOf(']');
      const json = start >= 0 && end >= 0 ? raw.slice(start, end + 1) : raw;
      const parsed = JSON.parse(json) as { front: string; back: string }[];
      const newCards: Flashcard[] = parsed.map(p => ({ id: Date.now().toString() + Math.random().toString(36).slice(2), front: p.front, back: p.back }));
      setCardsByCourse(prev => ({ ...prev, [selectedCourseId]: [...(prev[selectedCourseId] || []), ...newCards] }));
      awardXp(20);
    } catch (e) {
      console.error(e);
      alert('Failed to generate flashcards. Please check your API key and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const text = await file.text();
      await generateFromText(text);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {courses.length === 0 && (
          <div className="text-sm text-gray-500">Add a course to create flashcards.</div>
        )}
        {courses.length === 1 && (
          <div className="px-3 py-2 rounded bg-indigo-50 text-indigo-700 text-sm">
            {courses[0].code} — {courses[0].topic}
          </div>
        )}
        {courses.length > 1 && (
          <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="border rounded px-3 py-2">
            {courses.map(c => (<option key={c.id} value={c.id}>{c.code} — {c.topic}</option>))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Front</p>
          <input value={front} onChange={(e) => setFront(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <p className="text-sm text-gray-600 mb-2">Back</p>
          <input value={back} onChange={(e) => setBack(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <button onClick={addCard} className="px-4 py-2 rounded bg-indigo-600 text-white">Add Card</button>
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 rounded bg-gray-100 text-gray-700 cursor-pointer">
                <input type="file" accept=".txt,.md,.csv,.json,.html,.pdf,.doc,.docx" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])} />
                {uploading ? 'Uploading...' : 'Upload file'}
              </label>
              <button onClick={() => generateFromText(cards.map(c => c.front + ' — ' + c.back).join('\n'))} disabled={generating || !apiKey} className={`px-4 py-2 rounded ${generating || !apiKey ? 'bg-gray-200 text-gray-500' : 'bg-purple-600 text-white'}`}>{generating ? 'Generating...' : 'Generate from existing'}</button>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded p-4">
          <p className="text-sm text-gray-600 mb-2">Cards ({cards.length})</p>
          <ul className="space-y-2 max-h-64 overflow-auto">
            {cards.map(c => (
              <li key={c.id} className="border rounded p-2 flex justify-between items-center">
                <span className="truncate max-w-[70%]">{c.front}</span>
                <button onClick={() => removeCard(c.id)} className="text-red-600 text-sm">Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={startPractice} disabled={cards.length === 0} className={`mt-3 px-4 py-2 rounded ${cards.length ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Practice</button>
        </div>
      </div>

      {current && (
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-2">Card {practiceIndex! + 1} / {cards.length}</div>
          <div className="card-scene mx-auto mb-4" style={{ width: 420, maxWidth: '100%' }}>
            <div className={`card relative rounded-xl shadow-lg bg-white`} style={{ height: 220, transform: showBack ? 'rotateY(180deg)' as any : undefined }}>
              <div className="card-face absolute inset-0 flex items-center justify-center p-6 rounded-xl">
                <div className="text-2xl font-semibold">{current.front}</div>
              </div>
              <div className="card-face card-back absolute inset-0 flex items-center justify-center p-6 rounded-xl bg-indigo-50">
                <div className="text-2xl font-semibold text-indigo-800">{current.back}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setShowBack(s => !s)} className="px-4 py-2 rounded bg-purple-100 text-purple-700">Flip</button>
            <button onClick={nextCard} className="px-4 py-2 rounded bg-gray-100 text-gray-700">Skip</button>
            <button onClick={iGotIt} className="px-4 py-2 rounded bg-green-600 text-white">I got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;


