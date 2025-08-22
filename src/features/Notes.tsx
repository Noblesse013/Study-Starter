import React, { useEffect, useMemo, useState } from 'react';

interface CourseRef {
  id: string;
  code: string;
  topic: string;
}

interface NotesProps {
  courses: CourseRef[];
  awardXp: (amount: number) => void;
}

type CourseIdToNotes = Record<string, string>;

const Notes: React.FC<NotesProps> = ({ courses, awardXp }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    const first = courses[0]?.id || '';
    const saved = localStorage.getItem('notes_selected_course');
    return saved || first;
  });
  const [notesByCourse, setNotesByCourse] = useState<CourseIdToNotes>(() => {
    const saved = localStorage.getItem('notes_by_course');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('notes_selected_course', selectedCourseId);
  }, [selectedCourseId]);

  // Keep selection valid when courses change
  useEffect(() => {
    if (!selectedCourseId && courses[0]?.id) {
      setSelectedCourseId(courses[0].id);
      return;
    }
    if (selectedCourseId && !courses.find(c => c.id === selectedCourseId)) {
      setSelectedCourseId(courses[0]?.id || '');
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    localStorage.setItem('notes_by_course', JSON.stringify(notesByCourse));
  }, [notesByCourse]);

  const currentText = selectedCourseId ? (notesByCourse[selectedCourseId] || '') : '';

  const setCurrentText = (text: string) => {
    setNotesByCourse(prev => ({ ...prev, [selectedCourseId]: text }));
  };

  const previewHtml = useMemo(() => {
    // minimal markdown: **bold**, *italic*, # heading, `code`, newlines
    const esc = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
    let html = esc(currentText);
    html = html.replace(/^# (.*)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
    html = html.replace(/\n/g, '<br/>');
    return html;
  }, [currentText]);

  const [savedAt, setSavedAt] = useState<number | null>(null);

  const handleSave = () => {
    if (!selectedCourseId) return; // must have a course to save
    // Force persist immediately and timestamp
    const next = { ...notesByCourse, [selectedCourseId]: currentText } as CourseIdToNotes;
    setNotesByCourse(next);
    localStorage.setItem('notes_by_course', JSON.stringify(next));
    setSavedAt(Date.now());
    if ((currentText || '').trim().length >= 100) {
      awardXp(10);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {courses.length === 0 && (
          <div className="text-sm text-gray-500">Add a course to start taking notes.</div>
        )}
        {courses.length === 1 && (
          <div className="px-3 py-2 rounded bg-indigo-50 text-indigo-700 text-sm">
            {courses[0].code} — {courses[0].topic}
          </div>
        )}
        {courses.length > 1 && (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code} — {c.topic}</option>
            ))}
          </select>
        )}
        <button onClick={handleSave} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder={courses.length === 0 ? 'Add a course to start taking notes' : 'Write rich notes here... supports # heading, **bold**, *italic*, `code`'}
          className={`min-h-[260px] border rounded p-3 w-full ${courses.length === 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
          disabled={courses.length === 0}
        />
        <div className="min-h-[260px] border rounded p-3 bg-white">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
      {savedAt && (
        <div className="text-xs text-gray-500 mt-2">Saved {new Date(savedAt).toLocaleTimeString()}</div>
      )}
    </div>
  );
};

export default Notes;


