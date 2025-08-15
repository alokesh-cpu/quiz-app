import React from 'react';
import { QuizSet } from './types';

interface QuizSelectionProps {
  quizSets: QuizSet[];
  participantName: string;
  onSelectQuiz: (quizSet: QuizSet) => void;
  onBack: () => void;
}

const QuizSelection: React.FC<QuizSelectionProps> = ({
  quizSets,
  participantName,
  onSelectQuiz,
  onBack
}) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Hard': return '#dc3545';
      default: return '#667eea';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '🟢';
      case 'Medium': return '🟡';
      case 'Hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="quiz-selection fade-in">
      <div className="selection-header">
        <button className="btn btn-back" onClick={onBack}>
          ← Back
        </button>
        
        <div className="participant-welcome">
          <div 
            className="participant-avatar medium"
            style={{ backgroundColor: getAvatarColor(participantName) }}
          >
            {participantName.charAt(0).toUpperCase()}
          </div>
          <h2 className="welcome-message">Welcome, {participantName}!</h2>
          <p className="selection-subtitle">Choose a quiz to test your knowledge</p>
        </div>
      </div>

      <div className="quiz-sets-grid">
        {quizSets.map((quizSet, index) => (
          <div 
            key={quizSet.id} 
            className="quiz-set-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="quiz-set-header">
              <h3 className="quiz-set-title">{quizSet.name}</h3>
              <div className="quiz-set-meta">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(quizSet.difficulty) }}
                >
                  {getDifficultyIcon(quizSet.difficulty)} {quizSet.difficulty}
                </span>
                <span className="time-estimate">⏱️ {quizSet.estimatedTime}</span>
              </div>
            </div>

            <div className="quiz-set-content">
              <p className="quiz-set-description">{quizSet.description}</p>
              
              <div className="quiz-stats">
                <div className="stat-item">
                  <span className="stat-icon">📝</span>
                  <span className="stat-text">{quizSet.questions.length} Questions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🎯</span>
                  <span className="stat-text">
                    {Array.from(new Set(quizSet.questions.map(q => q.category))).length} Categories
                  </span>
                </div>
              </div>

              <div className="category-preview">
                <h4 className="preview-title">Topics covered:</h4>
                <div className="category-tags">
                  {Array.from(new Set(quizSet.questions.map(q => q.category))).map(category => (
                    <span key={category} className="category-tag">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="quiz-set-actions">
              <button 
                className="btn btn-primary quiz-start-btn"
                onClick={() => onSelectQuiz(quizSet)}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="selection-footer">
        <div className="selection-tips">
          <h3 className="tips-title">💡 Quick Tips:</h3>
          <ul className="tips-list">
            <li>✅ Each quiz contains 25 carefully selected questions</li>
            <li>🎨 Get instant visual feedback on your answers</li>
            <li>📊 View detailed results and performance analysis</li>
            <li>🏆 Compare your scores on the leaderboard</li>
            <li>🔄 Retake any quiz to improve your score</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizSelection;
