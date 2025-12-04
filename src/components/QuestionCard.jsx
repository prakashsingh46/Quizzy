import './QuestionCard.css';

function QuestionCard({ question, questionNumber, selectedAnswer, onAnswer }) {
  return (
    <div className="question-card">
      <div className="question-number">Question {questionNumber}</div>
      
      <h3 className="question-text">{question.question}</h3>
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedAnswer === index ? 'selected' : ''
            }`}
            onClick={() => onAnswer(index)}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
