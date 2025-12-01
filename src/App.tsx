import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import StartScreen from './StartScreen';
import QuizSelection from './QuizSelection';
import QuizUpload from './QuizUpload';
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

  const [customQuizSets, setCustomQuizSets] = useState<QuizSet[]>([]);
  const [allQuizSets, setAllQuizSets] = useState<QuizSet[]>(quizSets);

  // Load custom quiz sets from localStorage
  useEffect(() => {
    const savedCustomQuizzes = localStorage.getItem('customQuizSets');
    if (savedCustomQuizzes) {
      try {
        const parsed = JSON.parse(savedCustomQuizzes);
        setCustomQuizSets(parsed);
        setAllQuizSets([...quizSets, ...parsed]);
      } catch (err) {
        console.error('Error loading custom quizzes:', err);
      }
    }
  }, []);

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

  const handleUploadQuiz = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'upload',
    }));
  };

  const handleQuizUploaded = (quizSet: QuizSet) => {
    const updatedCustomQuizzes = [...customQuizSets, quizSet];
    setCustomQuizSets(updatedCustomQuizzes);
    setAllQuizSets([...quizSets, ...updatedCustomQuizzes]);
    
    // Save to localStorage
    localStorage.setItem('customQuizSets', JSON.stringify(updatedCustomQuizzes));
    
    // Return to quiz selection
    setAppState(prev => ({
      ...prev,
      currentView: 'quiz-selection',
    }));
  };

  const handleCancelUpload = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'quiz-selection',
    }));
  };

  const handleDeleteQuiz = (quizSetId: string) => {
    // Only allow deletion of custom quizzes
    if (!quizSetId.startsWith('custom-')) {
      return;
    }

    // Remove from custom quiz sets
    const updatedCustomQuizzes = customQuizSets.filter(q => q.id !== quizSetId);
    setCustomQuizSets(updatedCustomQuizzes);
    setAllQuizSets([...quizSets, ...updatedCustomQuizzes]);
    
    // Save to localStorage
    localStorage.setItem('customQuizSets', JSON.stringify(updatedCustomQuizzes));

    // Also remove any results associated with this quiz
    const updatedResults = appState.quizResults.filter(r => r.quizSetId !== quizSetId);
    setAppState(prev => ({
      ...prev,
      quizResults: updatedResults,
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
            quizSets={allQuizSets}
            participantName={appState.currentParticipantName}
            onSelectQuiz={handleSelectQuiz}
            onBack={handleBackToStart}
            onUploadQuiz={handleUploadQuiz}
            onDeleteQuiz={handleDeleteQuiz}
          />
        )}

        {appState.currentView === 'upload' && (
          <QuizUpload
            onQuizUploaded={handleQuizUploaded}
            onCancel={handleCancelUpload}
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
