/**
 * AI Service for Quiz Generation and Feedback using Google Gemini API
 */

import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Rate limit counter to track consecutive failures
let rateLimitCounter = 0;
const MAX_RATE_LIMIT_FAILURES = 5; // Higher threshold for flash model

// Global flag to prefer mock data when rate limits are persistent
let preferMockData = false;

/**
 * Generate quiz questions for a given topic using Gemini AI
 * @param {string} topic - The topic for the quiz
 * @param {number} count - Number of questions to generate (default: 5)
 * @returns {Promise<Array>} Array of quiz questions
 */
export async function generateQuizQuestions(topic, count = 5) {
  console.log('🚀 Generating quiz questions for topic:', topic);
  
  // If we've had persistent rate limits, prefer mock data
  if (preferMockData || rateLimitCounter >= MAX_RATE_LIMIT_FAILURES) {
    console.log('⚠️ Using mock data due to rate limiting');
    return generateMockQuestions(topic, count);
  }
  
  const prompt = `Generate exactly ${count} multiple-choice quiz questions about "${topic}".

You must return ONLY a valid JSON array with NO additional text, markdown, or formatting. Just the raw JSON array.

Format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Rules:
- Each question must have exactly 4 options
- correctAnswer must be the index (0-3) of the correct option in the options array
- Questions should be clear, educational, and engaging
- Mix difficulty levels from easy to challenging
- Ensure all questions are directly related to "${topic}"
- Return ONLY the JSON array, absolutely no other text or formatting`;

  try {
    console.log('📡 Calling Gemini API...');
    const questions = await callGeminiAPI(prompt);
    console.log('Received response from Gemini:', questions);
    
    // Validate the response
    if (!Array.isArray(questions) || questions.length !== count) {
      console.error('Invalid response format from Gemini:', questions);
      throw new Error('Invalid question format');
    }
    
    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        console.error(`Invalid question at index ${index}:`, q);
        throw new Error(`Invalid question format at index ${index}`);
      }
    });
    
    console.log('Successfully generated', questions.length, 'questions');
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

/**
 * Generate personalized feedback based on quiz results using Gemini AI
 * @param {string} topic - The quiz topic
 * @param {number} score - User's score
 * @param {number} total - Total questions
 * @param {Array} questions - The quiz questions
 * @param {Object} userAnswers - User's answers
 * @returns {Promise<string>} Feedback message
 */
export async function generateFeedback(topic, score, total, questions = [], userAnswers = {}) {
  const percentage = Math.round((score / total) * 100);
  
  // If we've had persistent rate limits, prefer mock data
  if (preferMockData || rateLimitCounter >= MAX_RATE_LIMIT_FAILURES) {
    console.log('Using mock feedback due to rate limiting');
    return getMockFeedback(topic, score, total, percentage);
  }
  
  // Build detailed performance summary
  let performanceDetails = '';
  if (questions.length > 0) {
    performanceDetails = questions.map((q, idx) => {
      const userAnswer = userAnswers[idx];
      const isCorrect = userAnswer === q.correctAnswer;
      return `Q${idx + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`;
    }).join(', ');
  }
  
  const prompt = `A student just completed a quiz about "${topic}".

Results:
- Score: ${score} out of ${total} (${percentage}%)
- Performance: ${performanceDetails}

Generate a personalized, encouraging feedback message (2-3 sentences). You must return ONLY a valid JSON object with NO additional text or formatting.

Format:
{
  "message": "Your feedback message here"
}

Guidelines:
- Be encouraging and constructive
- If score is high (>80%): Celebrate their achievement and encourage continued learning
- If score is medium (50-80%): Acknowledge progress and suggest specific areas for improvement
- If score is low (<50%): Be supportive, motivate them, and suggest reviewing the material
- Keep it personal, friendly, and motivating
- Return ONLY the JSON object, no other text`;

  try {
    const result = await callGeminiAPI(prompt);
    
    if (result && result.message) {
      return result.message;
    }
    
    // Fallback message
    return `Great effort on completing the ${topic} quiz! You scored ${score} out of ${total}. Keep learning and practicing to improve your knowledge further.`;
  } catch (error) {
    console.error('Error generating feedback:', error);
    // Return fallback message
    return `Great effort on completing the ${topic} quiz! You scored ${score} out of ${total}. Keep learning and practicing to improve your knowledge further.`;
  }
}

/**
 * Fetch trending topics using Gemini AI
 * @returns {Promise<Array>} Array of trending topics
 */
export async function fetchTrendingTopics() {
  // If we've had persistent rate limits, prefer mock data
  if (preferMockData) {
    console.log('⚠️ Using mock trending topics due to rate limiting');
    return getFallbackTrendingTopics();
  }
  
  const prompt = `Generate a list of 12 current trending topics that would make great quiz subjects.

You must return ONLY a valid JSON array with NO additional text or formatting.

Format:
[
  {
    "id": 1,
    "title": "Topic Title",
    "description": "Brief description",
    "icon": "🔥",
    "category": "Category Name",
    "trend": "hot"
  }
]

Rules:
- Include diverse topics: technology, science, health, culture, current events, etc.
- Each topic should be currently relevant and interesting
- Use appropriate emoji icons
- trend can be: "hot" (very popular), "rising" (growing), or "steady" (consistently popular)
- Categories: Technology, Science, Health, Business, Arts, Current Events, etc.
- Make descriptions concise (10-15 words)
- Return ONLY the JSON array, no other text`;

  try {
    const topics = await callGeminiAPI(prompt);
    
    if (!Array.isArray(topics)) {
      throw new Error('Invalid trending topics format');
    }
    
    return topics;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    // Return fallback trending topics
    return getFallbackTrendingTopics();
  }
}

/**
 * Call Gemini API with retry logic
 * @param {string} prompt - The prompt to send
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<any>} Parsed JSON response
 */
async function callGeminiAPI(prompt, maxRetries = 3) {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not found in environment variables');
    throw new Error('Gemini API key not configured. Please check your .env file.');
  }
  
  console.log('🔑 API Key found:', GEMINI_API_KEY.substring(0, 10) + '...');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API attempt ${attempt}/${maxRetries}`);
      
      // Use the correct endpoint format with API key as query parameter
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
      console.log('🌐 Calling URL:', apiUrl.replace(GEMINI_API_KEY, 'API_KEY_HIDDEN'));
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post(apiUrl, requestBody, {
        params: {
          key: GEMINI_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`Response status: ${response.status}`);
      
      // Extract text from Gemini response
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.error('No text in Gemini response:', response.data);
        throw new Error('No text in Gemini response');
      }
      
      console.log('Extracted text:', text.substring(0, 200) + '...');

      // Clean up the response - remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log('🧹 Cleaned text:', cleanedText.substring(0, 200) + '...');

      // Parse JSON
      const parsed = JSON.parse(cleanedText);
      console.log('Successfully parsed JSON');
      
      return parsed;

    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      // Log full error details
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('General error:', error.message);
      }
      
      // Check for rate limit errors
      if (error.response && error.response.status === 429) {
        const errorMessage = error.response.data?.error?.message || '';
        
        // Check for quota exceeded (daily limit)
        if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          console.log('Daily quota exceeded. Switching to mock data.');
          preferMockData = true; // Permanently switch to mock data
          throw new Error('Daily quota exceeded. Showing sample questions instead.');
        }
        
        // Regular rate limit - retry
        if (attempt < maxRetries) {
          const waitTime = 5000 * attempt; // 5 seconds, 10 seconds, 15 seconds
          console.log(`Rate limit hit. Waiting ${waitTime/1000} seconds before retry...`);
          await sleep(waitTime);
          continue;
        }
      }
      
      if (attempt < maxRetries) {
        const waitTime = 1000 * attempt;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
        continue;
      }
      
      // All retries failed
      console.error('All retries exhausted');
      throw error;
    }
  }
}

/**
 * Fallback trending topics if API fails
 */
function getFallbackTrendingTopics() {
  return [
    {
      id: 1,
      title: 'AI & Machine Learning',
      description: 'Latest developments in artificial intelligence',
      icon: '🤖',
      trend: 'hot',
      category: 'Technology'
    },
    {
      id: 2,
      title: 'Climate Change',
      description: 'Environmental challenges and solutions',
      icon: '🌍',
      trend: 'hot',
      category: 'Science'
    },
    {
      id: 3,
      title: 'Space Exploration',
      description: 'Mars missions and beyond',
      icon: '🚀',
      trend: 'rising',
      category: 'Science'
    },
    {
      id: 4,
      title: 'Mental Wellness',
      description: 'Mindfulness and stress management',
      icon: '🧘',
      trend: 'rising',
      category: 'Health'
    },
    {
      id: 5,
      title: 'Cryptocurrency',
      description: 'Digital currencies and blockchain',
      icon: '💰',
      trend: 'steady',
      category: 'Finance'
    },
    {
      id: 6,
      title: 'Renewable Energy',
      description: 'Solar, wind, and clean power',
      icon: '☀️',
      trend: 'rising',
      category: 'Science'
    },
    {
      id: 7,
      title: 'Quantum Computing',
      description: 'Next-gen computing power',
      icon: '⚛️',
      trend: 'hot',
      category: 'Technology'
    },
    {
      id: 8,
      title: 'Electric Vehicles',
      description: 'Sustainable transportation',
      icon: '⚡',
      trend: 'rising',
      category: 'Technology'
    },
    {
      id: 9,
      title: 'Remote Work',
      description: 'Future of work and productivity',
      icon: '💼',
      trend: 'steady',
      category: 'Business'
    },
    {
      id: 10,
      title: 'Cybersecurity',
      description: 'Digital safety and privacy',
      icon: '🔒',
      trend: 'hot',
      category: 'Technology'
    },
    {
      id: 11,
      title: 'Gene Therapy',
      description: 'Medical breakthroughs and treatments',
      icon: '🧬',
      trend: 'rising',
      category: 'Science'
    },
    {
      id: 12,
      title: 'Sustainable Living',
      description: 'Eco-friendly lifestyle choices',
      icon: '♻️',
      trend: 'rising',
      category: 'Lifestyle'
    }
  ];
}

/**
 * Generate mock questions when API is unavailable
 */
function generateMockQuestions(topic, count) {
  const topics = {
    'technology': [
      {
        question: 'What does CPU stand for?',
        options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process Unit', 'Central Program Unit'],
        correctAnswer: 0
      },
      {
        question: 'Which company developed the JavaScript programming language?',
        options: ['Microsoft', 'Apple', 'Netscape', 'Google'],
        correctAnswer: 2
      },
      {
        question: 'What is the primary purpose of CSS in web development?',
        options: ['Database management', 'Server-side scripting', 'Styling web pages', 'Network security'],
        correctAnswer: 2
      },
      {
        question: 'Which of these is NOT a programming paradigm?',
        options: ['Object-oriented', 'Functional', 'Relational', 'Procedural'],
        correctAnswer: 2
      },
      {
        question: 'What does HTTP stand for?',
        options: ['Hyper Text Transfer Protocol', 'High Tech Transmission Process', 'Home Tool Transfer Program', 'Hyperlink Text Transmission'],
        correctAnswer: 0
      }
    ],
    'science': [
      {
        question: 'What is the chemical symbol for gold?',
        options: ['Go', 'Au', 'Gd', 'Ag'],
        correctAnswer: 1
      },
      {
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
        correctAnswer: 2
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1
      },
      {
        question: 'What is the speed of light in vacuum?',
        options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'],
        correctAnswer: 0
      },
      {
        question: 'What is the pH of pure water?',
        options: ['5', '7', '9', '10'],
        correctAnswer: 1
      }
    ],
    'history': [
      {
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2
      },
      {
        question: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
        correctAnswer: 1
      },
      {
        question: 'Which ancient wonder is the only one still standing?',
        options: ['Colossus of Rhodes', 'Hanging Gardens', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'],
        correctAnswer: 2
      },
      {
        question: 'When did the Berlin Wall fall?',
        options: ['1987', '1989', '1991', '1993'],
        correctAnswer: 1
      },
      {
        question: 'Who discovered America in 1492?',
        options: ['Vasco da Gama', 'Christopher Columbus', 'Ferdinand Magellan', 'Marco Polo'],
        correctAnswer: 1
      }
    ]
  };
  
  // Try to find matching topic
  const topicKey = Object.keys(topics).find(key => 
    topic.toLowerCase().includes(key) || key.includes(topic.toLowerCase())
  );
  
  // Return questions for matching topic or default to technology
  const questions = topicKey ? topics[topicKey] : topics.technology;
  
  // Return only the requested count
  return questions.slice(0, count);
}

/**
 * Generate mock feedback when API is unavailable
 */
function getMockFeedback(topic, score, total, percentage) {
  if (percentage >= 80) {
    return `🎉 Excellent work on the ${topic} quiz! You scored ${score} out of ${total} (${percentage}%). Your knowledge is impressive! Keep exploring new topics to maintain your expertise.`;
  } else if (percentage >= 60) {
    return `👍 Good effort on the ${topic} quiz! You scored ${score} out of ${total} (${percentage}%). You have a solid foundation, but reviewing the material could help improve your score.`;
  } else if (percentage >= 40) {
    return `📚 Nice try on the ${topic} quiz! You scored ${score} out of ${total} (${percentage}%). Don't get discouraged - everyone learns at their own pace. Review the questions and try again!`;
  } else {
    return `💪 Keep going with the ${topic} quiz! You scored ${score} out of ${total} (${percentage}%). This is just the beginning of your learning journey. Review the material and try again to improve!`;
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
