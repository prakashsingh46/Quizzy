import './LoadingScreen.css';

function LoadingScreen({ topic, error }) {
  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-content error-content">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <p className="error-redirect">Redirecting you back to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-glow"></div>
        </div>
        
        <h2 className="loading-title">Generating Your Quiz</h2>
        <p className="loading-topic">Topic: <strong>{topic}</strong></p>
        
        <div className="loading-steps">
          <div className="loading-step">
            <span className="step-icon">🤖</span>
            <span className="step-text">AI is crafting questions...</span>
          </div>
          <div className="loading-step">
            <span className="step-icon">✨</span>
            <span className="step-text">Preparing options...</span>
          </div>
          <div className="loading-step">
            <span className="step-icon">🎯</span>
            <span className="step-text">Almost ready!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
