import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Play, PlusCircle, Save, Trash2, Trophy, Shuffle, ArrowLeft, Timer, NotebookPen, Layers, HelpCircle, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pomodoro from './features/Pomodoro';
import Notes from './features/Notes';
import Flashcards from './features/Flashcards';
import Quizzes from './features/Quizzes';
import Reminders from './features/Reminders';

// Define types for our data structures
interface Course {
  id: string;
  code: string;
  topic: string;
  createdAt: Date;
}

interface StudySession {
  id: string;
  courseId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in minutes
}

function App() {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Pomodoro' | 'Notes' | 'Flashcards' | 'Quizzes' | 'Reminders' | 'Profile'>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved as any) || 'Dashboard';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // State for course form
  const [courseCode, setCourseCode] = useState('');
  const [courseTopic, setCourseTopic] = useState('');
  
  // State for courses and study sessions
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('courses');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });
  
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const savedSessions = localStorage.getItem('studySessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  
  // State for active study session
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);

  // Gamification: XP and simple level calc
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('xp');
    return saved ? Number(saved) : 0;
  });
  const level = Math.floor(xp / 100) + 1; // 100 XP per level
  useEffect(() => {
    localStorage.setItem('xp', String(xp));
  }, [xp]);
  
  // State for selected course from shuffle
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  
  // State for motivation quotes
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const motivationalQuotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The best way to predict your future is to create it. - Abraham Lincoln",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Today is your opportunity to build the tomorrow you want. - Ken Poirot"
  ];
  
  // Save courses and study sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(studySessions));
  }, [studySessions]);
  
  // Set a random motivational quote on load and every 30 seconds
  useEffect(() => {
    const setRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setMotivationalQuote(motivationalQuotes[randomIndex]);
    };
    
    setRandomQuote();
    const interval = setInterval(setRandomQuote, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to add a new course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseCode.trim() || !courseTopic.trim()) return;
    
    const newCourse: Course = {
      id: Date.now().toString(),
      code: courseCode,
      topic: courseTopic,
      createdAt: new Date()
    };
    
    setCourses([...courses, newCourse]);
    setCourseCode('');
    setCourseTopic('');
  };
  
  // Function to delete a course
  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    // Also delete related study sessions
    setStudySessions(studySessions.filter(session => session.courseId !== id));
    
    // If the deleted course is the selected course, clear the selection
    if (selectedCourse && selectedCourse.id === id) {
      setSelectedCourse(null);
    }
  };
  
  // Function to start a study session
  const handleStartStudy = (courseId: string) => {
    // If there's already an active session, end it first
    if (activeSession) {
      handleEndStudy();
    }
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      courseId,
      startTime: new Date(),
      endTime: null,
      duration: 0
    };
    
    setActiveSession(newSession);
    setSelectedCourse(null); // Clear the selected course when starting a session
  };
  
  // Function to end a study session
  const handleEndStudy = () => {
    if (!activeSession) return;
    
    const endTime = new Date();
    const durationMs = endTime.getTime() - new Date(activeSession.startTime).getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    const completedSession: StudySession = {
      ...activeSession,
      endTime,
      duration: durationMinutes
    };
    
    setStudySessions([...studySessions, completedSession]);
    setActiveSession(null);
  };

  // Award XP helper
  const awardXp = (amount: number) => setXp(prev => prev + amount);
  const handlePomodoroWorkComplete = () => {
    // Award XP for completing a focus interval
    awardXp(25);
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus complete', { body: 'Great job! +25 XP' });
      }
    } catch {}
  };

  // Basic badges
  const badges = [
    { id: 'starter', label: 'Starter', earned: xp >= 10 },
    { id: 'focused', label: 'Focused 100', earned: xp >= 100 },
    { id: 'marathon', label: 'Marathon 500', earned: xp >= 500 },
    { id: 'session-5', label: '5 Sessions', earned: studySessions.length >= 5 },
    { id: 'session-20', label: '20 Sessions', earned: studySessions.length >= 20 }
  ];
  
  // Function to shuffle and select a random course
  const handleShuffleCourses = () => {
    if (courses.length === 0) return;
    
    setIsShuffling(true);
    setSelectedCourse(null);
    
    // Simulate shuffling animation by rapidly changing the selected course
    let shuffleCount = 0;
    const maxShuffles = 15; // Number of visual shuffles before settling
    
    const shuffleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * courses.length);
      setSelectedCourse(courses[randomIndex]);
      shuffleCount++;
      
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
      }
    }, 150); // Speed of the shuffle animation
  };
  
  // Calculate total study time for a course
  const getTotalStudyTime = (courseId: string) => {
    return studySessions
      .filter(session => session.courseId === courseId)
      .reduce((total, session) => total + session.duration, 0);
  };
  
  // Get the course name from its ID
  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.code}: ${course.topic}` : 'Unknown Course';
  };
  
  // Format minutes as hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };
  
  // Get recent study sessions (last 5)
  const recentSessions = [...studySessions]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center relative">
          <Link to="/" className="absolute left-0 top-2 text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Study Starter</h1>
          <div className="mt-4 p-4 glass elevate rounded-lg">
            <p className="italic text-gray-700">{motivationalQuote}</p>
          </div>
        </header>
        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex glass elevate rounded-lg">
            {[
              { key: 'Dashboard', icon: BookOpen },
              { key: 'Pomodoro', icon: Timer },
              { key: 'Notes', icon: NotebookPen },
              { key: 'Flashcards', icon: Layers },
              { key: 'Quizzes', icon: HelpCircle },
              { key: 'Reminders', icon: Bell },
              { key: 'Profile', icon: User }
            ].map(({ key, icon: Icon }: any) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 flex items-center border-r last:border-r-0 rounded-lg md:rounded-none md:first:rounded-l-lg md:last:rounded-r-lg ${
                  activeTab === key ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <Icon size={18} className="mr-2" />
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Summary row when not on Profile tab */}
        {activeTab !== 'Profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="glass elevate rounded-lg p-4">
              <h3 className="text-sm text-gray-500">Total Study Time</h3>
              <p className="text-2xl font-semibold text-indigo-700 mt-1">{
                formatDuration(studySessions.reduce((t, s) => t + s.duration, 0))
              }</p>
            </div>
            <div className="glass elevate rounded-lg p-4">
              <h3 className="text-sm text-gray-500">Sessions</h3>
              <p className="text-2xl font-semibold text-indigo-700 mt-1">{studySessions.length}</p>
            </div>
            <div className="glass elevate rounded-lg p-4">
              <h3 className="text-sm text-gray-500">Level / XP</h3>
              <p className="text-2xl font-semibold text-indigo-700 mt-1">Lv {level} · {xp} XP</p>
            </div>
          </div>
        )}

        {activeTab === 'Pomodoro' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="glass elevate rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                <Timer className="mr-2" size={24} />
                Pomodoro Timer
              </h2>
              <Pomodoro onWorkComplete={handlePomodoroWorkComplete} />
            </div>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="glass elevate rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                <User className="mr-2" size={24} />
                Your Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-indigo-50">
                  <p className="text-sm text-indigo-700">Level</p>
                  <p className="text-3xl font-bold text-indigo-800">{level}</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-700">XP</p>
                  <p className="text-3xl font-bold text-purple-800">{xp}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50">
                  <p className="text-sm text-green-700">Sessions</p>
                  <p className="text-3xl font-bold text-green-800">{studySessions.length}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {badges.map(b => (
                    <span key={b.id} className={`px-3 py-1 rounded-full text-sm ${b.earned ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-200 text-gray-500'}`}>
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Course Management Section */}
          <div className="glass elevate rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
              <BookOpen className="mr-2" size={24} />
              Add Course
            </h2>
            
            <form onSubmit={handleAddCourse} className="mb-6">
              <div className="mb-4">
                <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  id="courseCode"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="courseTopic" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Topic
                </label>
                <input
                  type="text"
                  id="courseTopic"
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                  placeholder="e.g. Introduction to Programming"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <PlusCircle className="mr-2" size={18} />
                Add Course
              </button>
            </form>
            
            {/* Course Shuffle Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
                <Shuffle className="mr-2" size={20} />
                Can't Decide?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Let us randomly select a course for you to study!
              </p>
              <button
                onClick={handleShuffleCourses}
                disabled={courses.length === 0 || isShuffling}
                className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                  courses.length === 0 || isShuffling
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 transition-colors'
                }`}
              >
                <Shuffle className="mr-2" size={18} />
                {isShuffling ? 'Shuffling...' : 'Shuffle Courses'}
              </button>
              
              {selectedCourse && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <h4 className="font-medium text-purple-800 mb-1">Selected Course:</h4>
                  <p className="font-bold text-lg mb-2">{selectedCourse.code}</p>
                  <p className="text-sm text-gray-700 mb-3">{selectedCourse.topic}</p>
                  <button
                    onClick={() => handleStartStudy(selectedCourse.id)}
                    disabled={activeSession !== null}
                    className={`w-full py-2 px-3 rounded-md flex items-center justify-center text-sm ${
                      activeSession !== null
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Play size={16} className="mr-1" />
                    Start This Course
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Course List Section */}
          <div className="glass elevate rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
              <BookOpen className="mr-2" size={24} />
              Your Courses
            </h2>
            
            {courses.length === 0 ? (
              <p className="text-gray-500 italic">No courses added yet. Add your first course to get started!</p>
            ) : (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li 
                    key={course.id} 
                    className={`border rounded-md p-4 ${
                      selectedCourse && selectedCourse.id === course.id 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{course.code}</h3>
                        <p className="text-gray-600">{course.topic}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock size={16} className="mr-1" />
                        {formatDuration(getTotalStudyTime(course.id))}
                      </span>
                      
                      <button
                        onClick={() => handleStartStudy(course.id)}
                        disabled={activeSession !== null}
                        className={`px-3 py-1 rounded-md flex items-center text-sm ${
                          activeSession !== null
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <Play size={16} className="mr-1" />
                        Start Studying
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Active Session & History Section */}
          <div className="glass elevate rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
              <Clock className="mr-2" size={24} />
              Study Session
            </h2>
            
            {activeSession ? (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-semibold text-lg text-green-800 mb-2">Currently Studying</h3>
                <p className="mb-2">{getCourseName(activeSession.courseId)}</p>
                <p className="text-sm text-gray-600 mb-3">
                  Started at: {new Date(activeSession.startTime).toLocaleTimeString()}
                </p>
                <button
                  onClick={handleEndStudy}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Save className="mr-2" size={18} />
                  End Session
                </button>
              </div>
            ) : (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                <p className="text-gray-600">No active study session</p>
                <p className="text-sm text-gray-500 mt-1">Select a course to start studying</p>
              </div>
            )}
            
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Trophy className="mr-2" size={20} />
              Recent Sessions
            </h3>
            
            {recentSessions.length === 0 ? (
              <p className="text-gray-500 italic">No study sessions recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentSessions.map((session) => (
                  <li key={session.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                    <p className="font-medium">{getCourseName(session.courseId)}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        {new Date(session.startTime).toLocaleDateString()} ({formatDuration(session.duration)})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        )}

        {activeTab === 'Notes' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="glass elevate rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                <NotebookPen className="mr-2" size={24} />
                Notes
              </h2>
              <Notes courses={courses} awardXp={awardXp} />
            </div>
          </div>
        )}

        {activeTab === 'Flashcards' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="glass elevate rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                <Layers className="mr-2" size={24} />
                Flashcards
              </h2>
              <Flashcards courses={courses} awardXp={awardXp} />
            </div>
          </div>
        )}

        {activeTab === 'Quizzes' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="glass elevate rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                <HelpCircle className="mr-2" size={24} />
                Quizzes
              </h2>
              <Quizzes courses={courses} awardXp={awardXp} />
            </div>
          </div>
        )}

        {activeTab === 'Reminders' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="glass elevate rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                <Bell className="mr-2" size={24} />
                Reminders
              </h2>
              <Reminders />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;