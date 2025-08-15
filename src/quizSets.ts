import { QuizSet } from './types';
import { quizData } from './quizData';
import { quizData2 } from './quizData2';
import { quizData3 } from './quizData3';

export const quizSets: QuizSet[] = [
  {
    id: 'general-knowledge-1',
    name: 'General Knowledge Quiz I',
    description: 'Test your knowledge across Geography, Science, History, Technology, Animals, and Art',
    questions: quizData,
    difficulty: 'Medium',
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'general-knowledge-2',
    name: 'General Knowledge Quiz II',
    description: 'Another challenging set covering Science, Art, Geography, Technology, Literature, and History',
    questions: quizData2,
    difficulty: 'Medium',
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'general-knowledge-3',
    name: 'General Knowledge Quiz III',
    description: 'Advanced questions spanning multiple disciplines including Science, Geography, Art, and more',
    questions: quizData3,
    difficulty: 'Hard',
    estimatedTime: '20-25 minutes'
  }
];
