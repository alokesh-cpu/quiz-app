import React from 'react';
import { QuizResult } from './types';

interface LeaderboardProps {
  results: QuizResult[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ results, onBack }) => {
  const getTopScores = () => {
    // Group results by participant name
    const participantMap = new Map<string, {
      name: string;
      bestScore: number;
      totalQuizzes: number;
      averageScore: number;
      bestResult: QuizResult | null;
      quizSetStats: Map<string, { attempts: number; bestScore: number; }>;
    }>();

    results.forEach(result => {
      const existing = participantMap.get(result.participantName);
      if (existing) {
        existing.totalQuizzes += 1;
        if (result.percentage > existing.bestScore) {
          existing.bestScore = result.percentage;
          existing.bestResult = result;
        }
        
        // Track quiz set specific stats
        const quizSetStat = existing.quizSetStats.get(result.quizSetId);
        if (quizSetStat) {
          quizSetStat.attempts += 1;
          if (result.percentage > quizSetStat.bestScore) {
            quizSetStat.bestScore = result.percentage;
          }
        } else {
          existing.quizSetStats.set(result.quizSetId, {
            attempts: 1,
            bestScore: result.percentage,
          });
        }
      } else {
        const quizSetStats = new Map();
        quizSetStats.set(result.quizSetId, {
          attempts: 1,
          bestScore: result.percentage,
        });
        
        participantMap.set(result.participantName, {
          name: result.participantName,
          bestScore: result.percentage,
          totalQuizzes: 1,
          averageScore: result.percentage,
          bestResult: result,
          quizSetStats,
        });
      }
    });

    // Calculate average scores
    participantMap.forEach((participant, name) => {
      const participantResults = results.filter(r => r.participantName === name);
      participant.averageScore = Math.round(
        participantResults.reduce((sum, r) => sum + r.percentage, 0) / participantResults.length
      );
    });

    return Array.from(participantMap.values())
      .sort((a, b) => b.bestScore - a.bestScore);
  };

  const getRecentResults = () => {
    return results
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const topScores = getTopScores();
  const recentResults = getRecentResults();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🏆';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="leaderboard fade-in">
      <div className="leaderboard-header">
        <button className="btn btn-back" onClick={onBack}>
          ← Back
        </button>
        <h2 className="leaderboard-title">Leaderboard</h2>
        <p className="leaderboard-subtitle">Quiz performance overview</p>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-section">
          <h3 className="section-title">🏆 Top Performers</h3>
          {topScores.length === 0 ? (
            <div className="no-data">
              <p>No quiz results yet!</p>
              <p className="text-muted">Complete some quizzes to see rankings</p>
            </div>
          ) : (
            <div className="ranking-list">
              {topScores.map((entry, index) => (
                <div key={entry.name} className="ranking-item">
                  <div className="rank-badge">
                    {getRankIcon(index)}
                  </div>
                  <div 
                    className="participant-avatar small"
                    style={{ backgroundColor: getAvatarColor(entry.name) }}
                  >
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ranking-info">
                    <h4 className="participant-name">{entry.name}</h4>
                    <div className="ranking-stats">
                      <span className="best-score">
                        Best: {entry.bestScore}%
                      </span>
                      <span className="average-score">
                        Avg: {entry.averageScore}%
                      </span>
                      <span className="quiz-count">
                        {entry.totalQuizzes} quiz{entry.totalQuizzes !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ width: `${entry.bestScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="leaderboard-section">
          <h3 className="section-title">📈 Recent Results</h3>
          {recentResults.length === 0 ? (
            <div className="no-data">
              <p>No recent results</p>
            </div>
          ) : (
            <div className="recent-results">
              {recentResults.map((result, index) => (
                <div key={`${result.participantId}-${result.date}`} className="result-item">
                  <div 
                    className="participant-avatar small"
                    style={{ backgroundColor: getAvatarColor(result.participantName) }}
                  >
                    {result.participantName.charAt(0).toUpperCase()}
                  </div>
                  <div className="result-info">
                    <h4 className="participant-name">{result.participantName}</h4>
                    <div className="quiz-set-name">{result.quizSetName}</div>
                    <div className="result-details">
                      <span className="score">{result.score}/{result.totalQuestions}</span>
                      <span className="percentage">{result.percentage}%</span>
                      <span className="date">{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="performance-badge">
                    {result.percentage >= 90 ? '🌟' :
                     result.percentage >= 80 ? '🎉' :
                     result.percentage >= 70 ? '👏' :
                     result.percentage >= 60 ? '📚' : '💪'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
