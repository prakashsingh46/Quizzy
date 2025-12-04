import { useState, useEffect } from 'react';
import { fetchTrendingTopics } from '../services/aiService';
import './Trending.css';

function Trending({ onTopicSelect }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTrendingTopics() {
      try {
        setLoading(true);
        const trendingTopics = await fetchTrendingTopics();
        setTopics(trendingTopics);
        setError(null);
      } catch (err) {
        console.error('Error loading trending topics:', err);
        setError('Failed to load trending topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadTrendingTopics();
  }, []);
  const getTrendBadge = (trend) => {
    const badges = {
      hot: { text: '🔥 Hot', color: '#FF5722' },
      rising: { text: '📈 Rising', color: '#4CAF50' },
      steady: { text: '⭐ Popular', color: '#2196F3' }
    };
    return badges[trend] || badges.steady;
  };

  const handleTopicClick = (topic) => {
    // If onTopicSelect is provided, convert trending topic to quiz topic format
    if (onTopicSelect) {
      const quizTopic = {
        id: topic.title.toLowerCase().replace(/\s+/g, '-'),
        title: topic.title,
        description: topic.description,
        icon: topic.icon
      };
      onTopicSelect(quizTopic);
    }
  };

  return (
    <div className="trending-page">
      <div className="trending-container">
        <div className="trending-hero">
          <h1 className="trending-title">🔥 Trending Topics</h1>
          <p className="trending-tagline">Discover what's popular right now</p>
        </div>

        {loading && (
          <div className="trending-loading">
            <div className="loader-spinner"></div>
            <p>Loading trending topics from AI...</p>
          </div>
        )}

        {error && (
          <div className="trending-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="trending-grid">
            {topics.map((topic) => {
              const badge = getTrendBadge(topic.trend);
              return (
                <div
                  key={topic.id}
                  className={`trending-card ${topic.trend}`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="trending-badge" style={{ background: badge.color }}>
                    {badge.text}
                  </div>
                  <div className="trending-icon">{topic.icon}</div>
                  <h3 className="trending-card-title">{topic.title}</h3>
                  <p className="trending-card-description">{topic.description}</p>
                  <div className="trending-card-footer">
                    <span className="trending-category">{topic.category}</span>
                    <span className="trending-arrow">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Trending;
