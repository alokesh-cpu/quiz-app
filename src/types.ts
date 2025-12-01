export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface QuizSet {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  totalQuizzes: number;
  bestScore: number;
}

export interface QuizResult {
  participantId: string;
  participantName: string;
  quizSetId: string;
  quizSetName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  timeTaken?: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  selectedAnswer: number | null;
  showResult: boolean;
  questions: Question[];
  answered: boolean;
  currentParticipant: string | null;
  startTime: number;
  userAnswers: (number | null)[];
  currentQuizSet: QuizSet;
}

export interface AppState {
  quizResults: QuizResult[];
  currentView: 'start' | 'quiz-selection' | 'upload' | 'quiz' | 'results' | 'leaderboard' | 'summary';
  currentParticipantName: string;
  currentQuizResult?: QuizResult;
  currentUserAnswers?: (number | null)[];
  selectedQuizSet?: QuizSet;
}
