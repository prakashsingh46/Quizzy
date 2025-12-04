import { useState } from 'react';
import QuestionCard from './QuestionCard';
import './Quiz.css';

function Quiz({ topic, questions, onComplete, onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (answerIndex) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, calculate score
      const score = questions.reduce((acc, question, index) => {
        return acc + (answers[index] === question.correctAnswer ? 1 : 0);
      }, 0);
      onComplete(score, answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canGoNext = answers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleExitConfirm = () => {
    if (onExit) {
      onExit();
    }
  };

  const handleExitCancel = () => {
    setShowExitConfirm(false);
  };

  return (
    <div className="quiz">
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="exit-modal-overlay" onClick={handleExitCancel}>
          <div className="exit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exit-modal-icon">⚠️</div>
            <h3 className="exit-modal-title">Exit Quiz?</h3>
            <p className="exit-modal-message">
              Are you sure you want to exit? Your progress will be lost.
            </p>
            <div className="exit-modal-actions">
              <button className="exit-modal-button cancel" onClick={handleExitCancel}>
                Continue Quiz
              </button>
              <button className="exit-modal-button confirm" onClick={handleExitConfirm}>
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-header-left">
          <h2 className="quiz-topic">{topic}</h2>
          <div className="quiz-progress-info">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <button className="exit-quiz-button" onClick={handleExitClick} title="Exit Quiz">
          <span className="exit-icon">✕</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        selectedAnswer={answers[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />

      {/* Navigation */}
      <div className="quiz-navigation">
        <button
          className="nav-button prev-button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Previous
        </button>

        <div className="question-indicators">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`indicator ${
                index === currentQuestionIndex ? 'active' : ''
              } ${answers[index] !== undefined ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            ></div>
          ))}
        </div>

        <button
          className="nav-button next-button"
          onClick={handleNext}
          disabled={!canGoNext}
        >
          {isLastQuestion ? 'Finish' : 'Next'} →
        </button>
      </div>
    </div>
  );
}

export default Quiz;
