import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import StartScreen from './StartScreen';
import QuizSelection from './QuizSelection';
import Leaderboard from './Leaderboard';
import QuizSummary from './QuizSummary';
import { quizSets } from './quizSets';
import { QuizResult, AppState, QuizSet } from './types';
import './App.css';

function App() {
  const [appState, setAppState] = useState<AppState>({
    quizResults: [],
    currentView: 'start',
    currentParticipantName: '',
    currentQuizResult: undefined,
    currentUserAnswers: undefined,
    selectedQuizSet: undefined,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedResults = localStorage.getItem('quiz-results');
    
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        setAppState(prev => ({ ...prev, quizResults: results }));
      } catch (error) {
        console.error('Error loading results:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quiz-results', JSON.stringify(appState.quizResults));
  }, [appState.quizResults]);

  const handleStartQuiz = (participantName: string) => {
    setAppState(prev => ({
      ...prev,
      currentParticipantName: participantName,
      currentView: 'quiz-selection',
    }));
  };

  const handleSelectQuiz = (quizSet: QuizSet) => {
    setAppState(prev => ({
      ...prev,
      selectedQuizSet: quizSet,
      currentView: 'quiz',
    }));
  };

  const handleQuizComplete = (result: QuizResult, userAnswers: (number | null)[]) => {
    setAppState(prev => ({
      ...prev,
      quizResults: [...prev.quizResults, result],
      currentQuizResult: result,
      currentUserAnswers: userAnswers,
      currentView: 'summary',
    }));
  };

  const handleBackToStart = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'start',
      currentParticipantName: '',
      currentQuizResult: undefined,
      currentUserAnswers: undefined,
    }));
  };

  const handleViewResults = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'leaderboard',
    }));
  };

  const handleRetakeQuiz = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'quiz-selection',
      currentQuizResult: undefined,
      currentUserAnswers: undefined,
    }));
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h1 className="quiz-title">Quiz Master</h1>
          <p className="quiz-subtitle">Test your knowledge across various topics</p>
        </div>
        
        {appState.currentView === 'start' && (
          <StartScreen
            onStartQuiz={handleStartQuiz}
            onViewResults={handleViewResults}
            hasResults={appState.quizResults.length > 0}
          />
        )}
        
        {appState.currentView === 'quiz-selection' && (
          <QuizSelection
            quizSets={quizSets}
            participantName={appState.currentParticipantName}
            onSelectQuiz={handleSelectQuiz}
            onBack={handleBackToStart}
          />
        )}
        
        {appState.currentView === 'quiz' && appState.selectedQuizSet && (
          <Quiz
            quizSet={appState.selectedQuizSet}
            participantName={appState.currentParticipantName}
            onQuizComplete={handleQuizComplete}
            onBack={handleBackToStart}
          />
        )}
        
        {appState.currentView === 'summary' && appState.currentQuizResult && appState.currentUserAnswers && appState.selectedQuizSet && (
          <QuizSummary
            result={appState.currentQuizResult}
            questions={appState.selectedQuizSet.questions}
            userAnswers={appState.currentUserAnswers}
            onRetakeQuiz={handleRetakeQuiz}
            onBackToStart={handleBackToStart}
            onViewLeaderboard={handleViewResults}
          />
        )}
        
        {appState.currentView === 'leaderboard' && (
          <Leaderboard
            results={appState.quizResults}
            onBack={handleBackToStart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
