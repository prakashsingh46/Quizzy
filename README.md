# Quizzy
This repository contains code of AI powered quiz application which is made using ReactJs and Gemini API
# Quizzy - AI-Powered Quiz Application

An interactive quiz application that generates dynamic MCQs using Google Gemini AI and provides personalized feedback based on user performance.

## 1. Project Setup & Demo

### Web
Run `npm install && npm run dev` to launch locally.

### Mobile
This is a web-based React application. For mobile experience:
- Access the hosted web application on mobile browsers
- Or use responsive development tools in browser DevTools to simulate mobile experience

### Demo
Hosted Link: http://localhost:5173 (when running locally)

## 2. Problem Understanding

### Requirements Summary
- Create an interactive quiz application with 4 screens:
  1. Topic selection screen with predefined topics and custom input
  2. AI-generated loading screen for 5 MCQs with options and correct answers
  3. Quiz display with one question at a time, navigation controls, and progress bar
  4. Results screen with AI-generated personalized feedback based on score
- Implement persistent navigation bar with Home, About, Contact, and Trending pages
- Enable custom topic input on home screen
- Allow quiz termination mid-way
- Use Google Gemini API for dynamic question generation and feedback
- Include error handling and retry mechanisms for AI calls

### Assumptions Made
- Users have basic familiarity with quiz applications
- Internet connectivity is available for AI API calls
- API key is configured in environment variables
- Application should gracefully handle API rate limits and failures
- Mock data fallback is acceptable when API is unavailable

## 3. AI Prompts & Iterations

### Initial Prompts
```
Generate exactly 5 multiple-choice quiz questions about "{topic}".

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
- correctAnswer must be the index (0-3) of the correct option
- Questions should be clear, educational, and engaging
- Mix difficulty levels from easy to challenging
- Ensure all questions relate to "{topic}"
- Return ONLY the JSON array, no other text
```

### Issues Faced
1. **Rate Limiting**: Frequent "429 RESOURCE_EXHAUSTED" errors due to API quota limitations
2. **Model Availability**: Initial model selection issues with gemini-pro vs gemini-2.5-flash
3. **JSON Parsing**: Inconsistent response formatting from AI requiring cleanup logic
4. **Error Handling**: Need for robust retry mechanisms and graceful fallbacks

### Refined Prompts
```
Generate exactly 5 multiple-choice quiz questions about "{topic}".

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
- Ensure all questions are directly related to "{topic}"
- Return ONLY the JSON array, absolutely no other text or formatting
```

## 4. Architecture & Code Structure

### `src/App.jsx`
Main application component that manages navigation between screens and global state including:
- Current screen state (HOME, LOADING, QUIZ, RESULTS, etc.)
- Selected topic and generated questions
- User score and answers
- Error handling and navigation logic

### Components & Screens
- `src/components/Navbar.jsx` - Persistent navigation bar with Home, About, Contact, Trending
- `src/components/TopicSelection.jsx` - Topic selection screen with custom input
- `src/components/LoadingScreen.jsx` - AI generation loading state with animations
- `src/components/Quiz.jsx` - Main quiz interface with question navigation
- `src/components/QuestionCard.jsx` - Individual question display component
- `src/components/Results.jsx` - Results screen with detailed feedback
- `src/pages/About.jsx` - About page content
- `src/pages/Contact.jsx` - Contact page content
- `src/pages/Trending.jsx` - Trending topics screen

### Services
- `src/services/aiService.js` - Handles all AI API calls using Axios
  - `generateQuizQuestions()` - Generates quiz questions for a given topic
  - `generateFeedback()` - Creates personalized feedback based on quiz results
  - `fetchTrendingTopics()` - Retrieves current trending topics
  - Implements retry logic, error handling, and mock data fallback

### State Management
- React useState hooks for component-level state
- Props drilling for data flow between components
- Global state managed in App.jsx and passed down to children

### Key Features Implemented
- Dynamic question generation via Google Gemini API
- Smart rate limit handling with automatic fallback to mock data
- Responsive design with mobile-friendly UI
- Interactive navigation with progress tracking
- Personalized AI feedback based on performance
- Error resilience with retry mechanisms
- Modern UI with glass-morphism effects and animations