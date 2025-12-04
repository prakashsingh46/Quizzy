import { useState, useEffect } from 'react';
import { generateFeedback } from '../services/aiService';
import './Results.css';

function Results({ topic, score, total, questions, userAnswers, onRestart }) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    async function loadFeedback() {
      try {
        const aiFeedback = await generateFeedback(topic, score, total, questions, userAnswers);
        setFeedback(aiFeedback);
      } catch (error) {
        console.error('Error generating feedback:', error);
        setFeedback(getDefaultFeedback(percentage));
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, [topic, score, total, percentage, questions, userAnswers]);

  function getDefaultFeedback(percentage) {
    if (percentage >= 80) {
      return "Excellent work! You've demonstrated strong knowledge of this topic. Keep up the great work!";
    } else if (percentage >= 60) {
      return "Good job! You have a solid understanding. Review the questions you missed to further improve.";
    } else if (percentage >= 40) {
      return "Not bad! There's room for improvement. Keep learning and try again to boost your score.";
    } else {
      return "Keep practicing! Learning takes time. Review the material and don't hesitate to try again.";
    }
  }

  function getScoreEmoji() {
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '💪';
    return '📚';
  }

  function getScoreColor() {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#2196F3';
    if (percentage >= 40) return '#FF9800';
    return '#F44336';
  }

  return (
    <div className="results">
      <div className="results-container">
        {/* Score Display */}
        <div className="score-display">
          <div className="score-emoji">{getScoreEmoji()}</div>
          <h1 className="results-title">Quiz Complete!</h1>
          <div 
            className="score-circle"
            style={{ '--score-color': getScoreColor() }}
          >
            <div className="score-percentage">{percentage}%</div>
            <div className="score-fraction">{score} / {total}</div>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="feedback-section">
          <h3 className="feedback-title">
            {loading ? '🤖 Generating Feedback...' : '💬 AI Feedback'}
          </h3>
          {loading ? (
            <div className="feedback-loader">
              <div className="mini-spinner"></div>
            </div>
          ) : (
            <p className="feedback-message">{feedback}</p>
          )}
        </div>

        {/* Review Answers */}
        <div className="review-section">
          <h3 className="review-title">📝 Review Your Answers</h3>
          <div className="answers-list">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div 
                  key={index} 
                  className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="answer-header">
                    <span className="answer-number">Question {index + 1}</span>
                    <span className={`answer-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="answer-question">{question.question}</p>
                  <div className="answer-details">
                    <div className={`your-answer ${isCorrect ? 'correct-choice' : 'incorrect-choice'}`}>
                      <strong>Your answer:</strong> {question.options[userAnswer]}
                    </div>
                    {!isCorrect && (
                      <div className="correct-answer">
                        <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                      </div>
                    )}
                    {isCorrect && (
                      <div className="correct-confirmation">
                        <strong>✓ You got it right!</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="action-button primary" onClick={onRestart}>
            🔄 Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
