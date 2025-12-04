import { useState } from 'react';
import Navbar from './components/Navbar';
import TopicSelection from './components/TopicSelection';
import LoadingScreen from './components/LoadingScreen';
import Quiz from './components/Quiz';
import Results from './components/Results';
import About from './pages/About';
import Contact from './pages/Contact';
import Trending from './pages/Trending';
import { generateQuizQuestions } from './services/aiService';
import './App.css';

const SCREENS = {
  HOME: 'home',
  TRENDING: 'trending',
  ABOUT: 'about',
  CONTACT: 'contact',
  LOADING: 'loading',
  QUIZ: 'quiz',
  RESULTS: 'results'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOME);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [error, setError] = useState(null);

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setCurrentScreen(SCREENS.LOADING);
    setError(null);

    try {
      // Generate quiz questions using AI
      const generatedQuestions = await generateQuizQuestions(topic.title, 5);
      
      // Validate that we got questions
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }
      
      setQuestions(generatedQuestions);
      setCurrentScreen(SCREENS.QUIZ);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError(error.message || 'Failed to generate quiz questions. Please check your internet connection and try again.');
      // Go back to home screen on error
      setTimeout(() => {
        setCurrentScreen(SCREENS.HOME);
        setError(null);
      }, 5000);
    }
  };

  const handleQuizComplete = (finalScore, answers) => {
    setScore(finalScore);
    setUserAnswers(answers);
    setCurrentScreen(SCREENS.RESULTS);
  };

  const handleQuizExit = () => {
    setCurrentScreen(SCREENS.HOME);
    setSelectedTopic(null);
    setQuestions([]);
    setScore(0);
    setUserAnswers({});
  };

  const handleRestart = () => {
    setCurrentScreen(SCREENS.HOME);
    setSelectedTopic(null);
    setQuestions([]);
    setScore(0);
    setUserAnswers({});
  };

  const handleNavigation = (section) => {
    if (section === 'home') {
      setCurrentScreen(SCREENS.HOME);
    } else if (section === 'trending') {
      setCurrentScreen(SCREENS.TRENDING);
    } else if (section === 'about') {
      setCurrentScreen(SCREENS.ABOUT);
    } else if (section === 'contact') {
      setCurrentScreen(SCREENS.CONTACT);
    }
    // Reset quiz state when navigating away
    setSelectedTopic(null);
    setQuestions([]);
    setScore(0);
    setUserAnswers({});
  };

  return (
    <div className="app">
      <Navbar currentScreen={currentScreen} onNavigate={handleNavigation} />
      
      {currentScreen === SCREENS.HOME && (
        <TopicSelection onTopicSelect={handleTopicSelect} />
      )}

      {currentScreen === SCREENS.TRENDING && (
        <Trending onTopicSelect={handleTopicSelect} />
      )}

      {currentScreen === SCREENS.ABOUT && (
        <About />
      )}

      {currentScreen === SCREENS.CONTACT && (
        <Contact />
      )}

      {currentScreen === SCREENS.LOADING && (
        <LoadingScreen topic={selectedTopic?.title} error={error} />
      )}

      {currentScreen === SCREENS.QUIZ && questions.length > 0 && (
        <Quiz
          topic={selectedTopic?.title}
          questions={questions}
          onComplete={handleQuizComplete}
          onExit={handleQuizExit}
        />
      )}

      {currentScreen === SCREENS.RESULTS && (
        <Results
          topic={selectedTopic?.title}
          score={score}
          total={questions.length}
          questions={questions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
