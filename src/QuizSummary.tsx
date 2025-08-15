import React from 'react';
import { QuizResult, Question } from './types';

interface QuizSummaryProps {
  result: QuizResult;
  questions: Question[];
  userAnswers: (number | null)[];
  onRetakeQuiz: () => void;
  onBackToStart: () => void;
  onViewLeaderboard: () => void;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({
  result,
  questions,
  userAnswers,
  onRetakeQuiz,
  onBackToStart,
  onViewLeaderboard,
}) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! You're a quiz master! 🌟", color: "#28a745" };
    if (percentage >= 80) return { message: "Excellent work! You know your stuff! 🎉", color: "#17a2b8" };
    if (percentage >= 70) return { message: "Great job! Well done! 👏", color: "#ffc107" };
    if (percentage >= 60) return { message: "Good effort! Keep learning! 📚", color: "#fd7e14" };
    return { message: "Don't worry, practice makes perfect! 💪", color: "#dc3545" };
  };

  const getQuestionResult = (index: number) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = questions[index].correctAnswer;
    
    if (userAnswer === null) return 'skipped';
    if (userAnswer === correctAnswer) return 'correct';
    return 'incorrect';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const scoreInfo = getScoreMessage(result.percentage);
  const correctAnswers = result.score;
  const incorrectAnswers = result.totalQuestions - result.score;

  return (
    <div className="quiz-summary fade-in">
      {/* Header Section */}
      <div className="summary-header">
        <div 
          className="participant-avatar large"
          style={{ backgroundColor: getAvatarColor(result.participantName) }}
        >
          {result.participantName.charAt(0).toUpperCase()}
        </div>
        <h2 className="summary-title">Quiz Complete, {result.participantName}!</h2>
        <div className="completion-date">
          Completed on {new Date(result.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Score Overview */}
      <div className="score-overview">
        <div className="score-circle">
          <div className="score-display">
            <span className="score-number">{result.score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{result.totalQuestions}</span>
          </div>
          <div className="score-percentage">{result.percentage}%</div>
        </div>
        
        <div className="score-message" style={{ color: scoreInfo.color }}>
          {scoreInfo.message}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card correct">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{correctAnswers}</div>
          <div className="stat-label">Correct</div>
        </div>
        
        <div className="stat-card incorrect">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{incorrectAnswers}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        
        <div className="stat-card accuracy">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{result.percentage}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        
        <div className="stat-card time">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">
            {result.timeTaken ? formatTime(result.timeTaken) : '--:--'}
          </div>
          <div className="stat-label">Time Taken</div>
        </div>
      </div>

      {/* Performance by Category */}
      <div className="category-performance">
        <h3 className="section-title">Performance by Category</h3>
        <div className="category-stats">
          {(() => {
            const categoryStats = new Map<string, { correct: number; total: number }>();
            
            questions.forEach((question, index) => {
              const category = question.category;
              const isCorrect = getQuestionResult(index) === 'correct';
              
              if (!categoryStats.has(category)) {
                categoryStats.set(category, { correct: 0, total: 0 });
              }
              
              const stats = categoryStats.get(category)!;
              stats.total += 1;
              if (isCorrect) stats.correct += 1;
            });

            return Array.from(categoryStats.entries()).map(([category, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <span className="category-name">{category}</span>
                    <span className="category-score">{stats.correct}/{stats.total}</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="category-percentage">{percentage}%</div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Question Review */}
      <div className="question-review">
        <h3 className="section-title">Question Review</h3>
        <div className="questions-grid">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const result = getQuestionResult(index);
            
            return (
              <div key={question.id} className={`question-summary ${result}`}>
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className="question-category">{question.category}</span>
                  <span className={`result-icon ${result}`}>
                    {result === 'correct' ? '✅' : result === 'incorrect' ? '❌' : '⏭️'}
                  </span>
                </div>
                
                <div className="question-text">{question.question}</div>
                
                <div className="answers-summary">
                  {userAnswer !== null && (
                    <div className={`user-answer ${result}`}>
                      <strong>Your answer:</strong> {question.options[userAnswer]}
                    </div>
                  )}
                  
                  {result === 'incorrect' && (
                    <div className="correct-answer">
                      <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="summary-actions">
        <button className="btn btn-primary" onClick={onRetakeQuiz}>
          🔄 Take Quiz Again
        </button>
        <button className="btn btn-secondary" onClick={onViewLeaderboard}>
          🏆 View Leaderboard
        </button>
        <button className="btn btn-outline" onClick={onBackToStart}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuizSummary;
