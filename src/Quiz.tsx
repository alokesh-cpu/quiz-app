import React, { useState, useEffect } from 'react';
import { Question, QuizState, QuizResult, QuizSet } from './types';

interface QuizProps {
  quizSet: QuizSet;
  participantName: string;
  onQuizComplete: (result: QuizResult, userAnswers: (number | null)[]) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ quizSet, participantName, onQuizComplete, onBack }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    selectedAnswer: null,
    showResult: false,
    questions: quizSet.questions,
    answered: false,
    currentParticipant: participantName,
    startTime: Date.now(),
    userAnswers: new Array(quizSet.questions.length).fill(null),
    currentQuizSet: quizSet,
  });

  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100;

  const handleAnswerSelect = (selectedIndex: number) => {
    if (quizState.answered) return;

    // Update user answers array
    const newUserAnswers = [...quizState.userAnswers];
    newUserAnswers[quizState.currentQuestion] = selectedIndex;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: selectedIndex,
      answered: true,
      userAnswers: newUserAnswers,
      score: selectedIndex === currentQuestion.correctAnswer 
        ? prev.score + 1 
        : prev.score
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        answered: false,
      }));
    } else {
      // Quiz completed - calculate results
      const timeTaken = Date.now() - quizState.startTime;
      const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
      
      const result: QuizResult = {
        participantId: Date.now().toString(), // Generate unique ID
        participantName: participantName,
        quizSetId: quizSet.id,
        quizSetName: quizSet.name,
        score: quizState.score,
        totalQuestions: quizState.questions.length,
        percentage,
        date: new Date().toISOString(),
        timeTaken: Math.round(timeTaken / 1000), // in seconds
      };

      onQuizComplete(result, quizState.userAnswers);
      
      setQuizState(prev => ({
        ...prev,
        showResult: true,
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      showResult: false,
      questions: quizSet.questions,
      answered: false,
      currentParticipant: participantName,
      startTime: Date.now(),
      userAnswers: new Array(quizSet.questions.length).fill(null),
      currentQuizSet: quizSet,
    });
  };

  const getScoreMessage = () => {
    const percentage = (quizState.score / quizState.questions.length) * 100;
    if (percentage >= 90) return "Outstanding! You're a quiz master! 🌟";
    if (percentage >= 80) return "Excellent work! You know your stuff! 🎉";
    if (percentage >= 70) return "Great job! Well done! 👏";
    if (percentage >= 60) return "Good effort! Keep learning! 📚";
    return "Don't worry, practice makes perfect! 💪";
  };

  if (quizState.showResult) {
    return (
      <div className="result-container fade-in">
        <h2 className="result-title">Quiz Complete!</h2>
        <div className="score-display">
          {quizState.score}/{quizState.questions.length}
        </div>
        <div className="score-message">
          {getScoreMessage()}
        </div>
        <div className="score-breakdown">
          <div className="score-item">
            <span className="score-label">Correct Answers:</span>
            <span className="score-value">{quizState.score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Total Questions:</span>
            <span className="score-value">{quizState.questions.length}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Accuracy:</span>
            <span className="score-value">
              {((quizState.score / quizState.questions.length) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="quiz-actions">
          <button className="btn" onClick={resetQuiz}>
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {quizState.currentQuestion + 1} of {quizState.questions.length}
        </div>
      </div>

      <div className="question-container">
        <div className="category-badge">
          {currentQuestion.category}
        </div>
        <h2 className="question-text">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = 'option-button';
          
          if (quizState.answered) {
            if (index === currentQuestion.correctAnswer) {
              buttonClass += ' correct';
            } else if (index === quizState.selectedAnswer && index !== currentQuestion.correctAnswer) {
              buttonClass += ' incorrect';
            }
          } else if (index === quizState.selectedAnswer) {
            buttonClass += ' selected';
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswerSelect(index)}
              disabled={quizState.answered}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <div className="quiz-actions">
        {quizState.answered && (
          <button className="btn" onClick={handleNextQuestion}>
            {quizState.currentQuestion < quizState.questions.length - 1 
              ? 'Next Question' 
              : 'Show Results'
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
