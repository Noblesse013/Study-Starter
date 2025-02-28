import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Shuffle, 
  Trophy, 
  Brain, 
  Rocket, 
  ArrowRight, 
  GraduationCap 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <GraduationCap size={80} className="text-indigo-600 mx-auto" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-indigo-800 mb-4"
        >
          Study Starter
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-indigo-600 mb-8 max-w-2xl"
        >
          Your personal study companion to overcome procrastination and build consistent study habits
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            to="/app" 
            className="bg-indigo-600 text-white text-lg font-medium py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors shadow-lg flex items-center"
          >
            Get Started <ArrowRight className="ml-2" size={20} />
          </Link>
        </motion.div>
      </header>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">How Study Starter Helps You</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Course Organization</h3>
            <p className="text-gray-600">
              Easily add and organize all your courses in one place. Keep track of what you need to study.
            </p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shuffle className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Random Selection</h3>
            <p className="text-gray-600">
              Can't decide what to study first? Let our shuffle feature randomly select a course for you.
            </p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Clock className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Study Tracking</h3>
            <p className="text-gray-600">
              Track your study sessions and see how much time you've dedicated to each course.
            </p>
          </motion.div>
          
          {/* Feature 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Brain className="text-yellow-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Motivation Boost</h3>
            <p className="text-gray-600">
              Get inspired with rotating motivational quotes to keep you focused and energized.
            </p>
          </motion.div>
          
          {/* Feature 5 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Trophy className="text-red-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Progress History</h3>
            <p className="text-gray-600">
              Review your recent study sessions and celebrate your progress over time.
            </p>
          </motion.div>
          
          {/* Feature 6 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Rocket className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Beat Procrastination</h3>
            <p className="text-gray-600">
              Designed specifically to help you overcome procrastination and start studying now.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0"
              >
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Add Your Courses</h3>
                <p className="text-gray-600">
                  Start by adding all your courses with their course codes and topics. This helps you organize what you need to study.
                </p>
              </motion.div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0"
              >
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Choose a Course or Shuffle</h3>
                <p className="text-gray-600">
                  Select a course to study or use the shuffle feature if you're having trouble deciding where to start.
                </p>
              </motion.div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0"
              >
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Start Studying</h3>
                <p className="text-gray-600">
                  Begin your study session with a single click. The timer will start tracking your study time automatically.
                </p>
              </motion.div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0"
              >
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Track Your Progress</h3>
                <p className="text-gray-600">
                  End your session when you're done, and your study time will be recorded. Review your history to see your progress.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">Ready to Start Studying?</h2>
          <p className="text-xl text-indigo-600 mb-8">
            Stop procrastinating and start building better study habits today.
          </p>
          <Link 
            to="/app" 
            className="bg-indigo-600 text-white text-lg font-medium py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors shadow-lg inline-flex items-center"
          >
            Launch Study Starter <ArrowRight className="ml-2" size={20} />
          </Link>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Study Starter. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed to help students overcome procrastination and study effectively.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;