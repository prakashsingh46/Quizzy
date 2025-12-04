import { useState } from 'react';
import './TopicSelection.css';

const TOPICS = [
  {
    id: 'wellness',
    title: 'Wellness',
    description: 'Mental and physical health, mindfulness, and self-care',
    icon: '🧘',
    color: '#4CAF50'
  },
  {
    id: 'tech-trends',
    title: 'Tech Trends',
    description: 'Latest developments in technology and innovation',
    icon: '💻',
    color: '#2196F3'
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Physics, chemistry, biology, and scientific discoveries',
    icon: '🔬',
    color: '#9C27B0'
  },
  {
    id: 'history',
    title: 'History',
    description: 'World events, civilizations, and historical figures',
    icon: '📚',
    color: '#FF9800'
  },
  {
    id: 'geography',
    title: 'Geography',
    description: 'Countries, capitals, landmarks, and natural features',
    icon: '🌍',
    color: '#00BCD4'
  },
  {
    id: 'arts',
    title: 'Arts & Culture',
    description: 'Music, literature, painting, and cultural movements',
    icon: '🎨',
    color: '#E91E63'
  }
];

function TopicSelection({ onTopicSelect }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic.id);
    // Add slight delay for visual feedback before transitioning
    setTimeout(() => {
      onTopicSelect(topic);
    }, 200);
  };

  const handleCustomTopicSubmit = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      const customQuizTopic = {
        id: 'custom-' + Date.now(),
        title: customTopic.trim(),
        description: 'Custom topic quiz',
        icon: '✨',
        color: '#667eea'
      };
      setSelectedTopic(customQuizTopic.id);
      setTimeout(() => {
        onTopicSelect(customQuizTopic);
        setCustomTopic('');
      }, 200);
    }
  };

  return (
    <div className="topic-selection">
      <div className="header">
        <h1 className="title">Choose Your Quiz Topic</h1>
        <p className="subtitle">Select a topic to test your knowledge</p>
      </div>

      {/* Custom Topic Input */}
      <div className="custom-topic-section">
        <form onSubmit={handleCustomTopicSubmit} className="custom-topic-form">
          <div className="custom-topic-input-wrapper">
            <input
              type="text"
              className="custom-topic-input"
              placeholder="Or enter your own topic (e.g., 'Astronomy', 'Photography', 'Cooking')..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              maxLength={50}
            />
            <button 
              type="submit" 
              className="custom-topic-button"
              disabled={!customTopic.trim()}
            >
              <span className="button-icon">🚀</span>
              Start Quiz
            </button>
          </div>
        </form>
      </div>

      <div className="topics-grid">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            className={`topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
            onClick={() => handleTopicClick(topic)}
            style={{
              '--topic-color': topic.color
            }}
          >
            <div className="topic-icon">{topic.icon}</div>
            <h3 className="topic-title">{topic.title}</h3>
            <p className="topic-description">{topic.description}</p>
          </button>
        ))}
      </div>

      <footer className="footer">
        <p>Powered by AI • 5 questions per quiz</p>
      </footer>
    </div>
  );
}

export default TopicSelection;
