import React, { useState } from 'react';

interface StartScreenProps {
  onStartQuiz: (participantName: string) => void;
  onViewResults: () => void;
  hasResults: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartQuiz, onViewResults, hasResults }) => {
  const [participantName, setParticipantName] = useState('');
  const [error, setError] = useState('');

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = participantName.trim();
    
    if (!trimmedName) {
      setError('Please enter your name to start the quiz');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    setError('');
    onStartQuiz(trimmedName);
  };

  return (
    <div className="start-screen fade-in">
      <div className="start-content">
        <div className="welcome-section">
          <h2 className="welcome-title">Ready to Test Your Knowledge?</h2>
          <p className="welcome-subtitle">
            Answer multiple choice questions across various topics and see how you perform!
          </p>
          
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-icon">📚</span>
              <span className="info-text">20 Questions</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span className="info-text">Multiple Categories</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span className="info-text">No Time Limit</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🏆</span>
              <span className="info-text">Instant Results</span>
            </div>
          </div>
        </div>

        <form className="start-form" onSubmit={handleStartQuiz}>
          <div className="form-group">
            <label htmlFor="participantName" className="form-label">
              Enter Your Name
            </label>
            <input
              type="text"
              id="participantName"
              className={`name-input ${error ? 'error' : ''}`}
              placeholder="Your full name"
              value={participantName}
              onChange={(e) => {
                setParticipantName(e.target.value);
                if (error) setError('');
              }}
              maxLength={50}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <button type="submit" className="btn btn-start">
            Start Quiz
          </button>
        </form>

        {hasResults && (
          <div className="additional-actions">
            <button className="btn btn-secondary" onClick={onViewResults}>
              View Previous Results
            </button>
          </div>
        )}
      </div>
      
      <div className="quiz-preview">
        <h3 className="preview-title">What to Expect:</h3>
        <ul className="preview-list">
          <li>✅ Instant feedback on your answers</li>
          <li>🎨 Visual indicators for correct/incorrect choices</li>
          <li>📊 Progress tracking throughout the quiz</li>
          <li>📈 Detailed score analysis at the end</li>
          <li>🔄 Option to retake the quiz anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default StartScreen;
