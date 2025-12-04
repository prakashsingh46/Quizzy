import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">About Quizzy</h1>
          <p className="about-tagline">AI-Powered Learning Made Fun</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="section-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              Quizzy is designed to make learning interactive and engaging through 
              AI-generated quizzes. We believe that education should be accessible, 
              personalized, and enjoyable for everyone.
            </p>
          </section>

          <section className="about-section">
            <div className="section-icon">🤖</div>
            <h2>AI-Powered Questions</h2>
            <p>
              Our advanced AI technology generates unique, contextually relevant 
              questions tailored to each topic. Every quiz is a fresh learning 
              experience with intelligent feedback based on your performance.
            </p>
          </section>

          <section className="about-section">
            <div className="section-icon">📚</div>
            <h2>Diverse Topics</h2>
            <p>
              From wellness and technology to science, history, geography, and arts, 
              we cover a wide range of subjects. Explore new areas of knowledge or 
              deepen your expertise in your favorite topics.
            </p>
          </section>

          <section className="about-section">
            <div className="section-icon">🚀</div>
            <h2>How It Works</h2>
            <div className="steps-container">
              <div className="step-item">
                <span className="step-number">1</span>
                <p>Choose your topic</p>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <p>AI generates questions</p>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <p>Answer & navigate</p>
              </div>
              <div className="step-item">
                <span className="step-number">4</span>
                <p>Get personalized feedback</p>
              </div>
            </div>
          </section>

          <section className="about-section features">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <h3>Instant Generation</h3>
                <p>AI creates quizzes in seconds</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🎨</span>
                <h3>Beautiful UI</h3>
                <p>Modern, intuitive design</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📱</span>
                <h3>Responsive</h3>
                <p>Works on all devices</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💡</span>
                <h3>Smart Feedback</h3>
                <p>Personalized insights</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
