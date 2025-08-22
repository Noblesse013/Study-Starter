import React, { useEffect, useState } from 'react';

interface CourseRef { id: string; code: string; topic: string }
interface Question { id: string; text: string; options: string[]; correctIndex: number }
type QuizByCourse = Record<string, Question[]>;

interface QuizzesProps {
  courses: CourseRef[];
  awardXp: (amount: number) => void;
}

const Quizzes: React.FC<QuizzesProps> = ({ courses, awardXp }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => localStorage.getItem('quiz_selected_course') || courses[0]?.id || '');
  const [questionsByCourse, setQuestionsByCourse] = useState<QuizByCourse>(() => {
    const saved = localStorage.getItem('quizzes_by_course');
    return saved ? JSON.parse(saved) : {};
  });

  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const questions = questionsByCourse[selectedCourseId] || [];

  useEffect(() => { localStorage.setItem('quiz_selected_course', selectedCourseId); }, [selectedCourseId]);
  useEffect(() => { localStorage.setItem('quizzes_by_course', JSON.stringify(questionsByCourse)); }, [questionsByCourse]);

  const addQuestion = () => {
    if (!text.trim() || options.some(o => !o.trim())) return;
    const q: Question = { id: Date.now().toString(), text, options, correctIndex };
    setQuestionsByCourse(prev => ({ ...prev, [selectedCourseId]: [...(prev[selectedCourseId] || []), q] }));
    setText(''); setOptions(['', '', '', '']); setCorrectIndex(0);
  };

  const removeQuestion = (id: string) => {
    setQuestionsByCourse(prev => ({ ...prev, [selectedCourseId]: (prev[selectedCourseId] || []).filter(q => q.id !== id) }));
  };

  // Practice state
  const [inPractice, setInPractice] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [cursor, setCursor] = useState(0);

  const startPractice = () => {
    if (questions.length === 0) return;
    setInPractice(true); setCursor(0); setAnswers([]);
  };

  const selectAnswer = (idx: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[cursor] = idx;
      return next;
    });
  };

  const next = () => {
    if (cursor + 1 >= questions.length) {
      // finish
      const correct = questions.reduce((acc, q, i) => acc + ((answers[i] ?? -1) === q.correctIndex ? 1 : 0), 0);
      const xp = correct * 10; // 10 XP per correct
      if (xp > 0) awardXp(xp);
      setInPractice(false);
      return;
    }
    setCursor(c => c + 1);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {courses.length === 0 && (
          <div className="text-sm text-gray-500">Add a course to build quizzes.</div>
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

      {!inPractice && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">Question</p>
            <input value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
            <p className="text-sm text-gray-600 mb-2">Options</p>
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input value={o} onChange={(e) => setOptions(prev => prev.map((x, idx) => idx === i ? e.target.value : x))} className="flex-1 border rounded px-3 py-2" />
                <label className="flex items-center gap-1 text-sm"><input type="radio" name="correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} /> Correct</label>
              </div>
            ))}
            <button onClick={addQuestion} className="px-4 py-2 rounded bg-indigo-600 text-white">Add Question</button>
          </div>
          <div className="bg-white border rounded p-4">
            <p className="text-sm text-gray-600 mb-2">Questions ({questions.length})</p>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {questions.map(q => (
                <li key={q.id} className="border rounded p-2 flex justify-between items-center">
                  <span className="truncate max-w-[70%]">{q.text}</span>
                  <button onClick={() => removeQuestion(q.id)} className="text-red-600 text-sm">Delete</button>
                </li>
              ))}
            </ul>
            <button onClick={startPractice} disabled={questions.length === 0} className={`mt-3 px-4 py-2 rounded ${questions.length ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Practice</button>
          </div>
        </div>
      )}

      {inPractice && (
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-500 text-sm mb-2">Question {cursor + 1} / {questions.length}</div>
          <div className="text-xl font-semibold mb-4">{questions[cursor].text}</div>
          <div className="space-y-2 mb-4">
            {questions[cursor].options.map((opt, idx) => (
              <label key={idx} className={`block border rounded px-3 py-2 cursor-pointer ${answers[cursor] === idx ? 'border-indigo-600' : 'border-gray-200'}`}>
                <input type="radio" className="mr-2" checked={answers[cursor] === idx} onChange={() => selectAnswer(idx)} />
                {opt}
              </label>
            ))}
          </div>
          <button onClick={next} className="px-4 py-2 rounded bg-indigo-600 text-white">{cursor + 1 >= questions.length ? 'Finish' : 'Next'}</button>
        </div>
      )}
    </div>
  );
};

export default Quizzes;


