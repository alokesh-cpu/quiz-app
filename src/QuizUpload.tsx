import React, { useState } from 'react';
import { Question, QuizSet } from './types';

interface QuizUploadProps {
  onQuizUploaded: (quizSet: QuizSet) => void;
  onCancel: () => void;
}

const QuizUpload: React.FC<QuizUploadProps> = ({ onQuizUploaded, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [preview, setPreview] = useState<Question[]>([]);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const parseQuizFile = (content: string): Question[] => {
    const questions: Question[] = [];
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentQuestion: Partial<Question> = {};
    let questionId = 1;
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      const line = lines[lineIndex];

      // Check for question (starts with Q: or Question:)
      if (line.match(/^(Q:|Question:)/i)) {
        if (currentQuestion.question) {
          // Save previous question if it's complete
          if (isQuestionComplete(currentQuestion)) {
            questions.push(currentQuestion as Question);
            questionId++;
          }
          currentQuestion = {};
        }
        currentQuestion.id = questionId;
        currentQuestion.question = line.replace(/^(Q:|Question:)/i, '').trim();
        currentQuestion.options = [];
      }
      // Check for options (A:, B:, C:, D: or 1., 2., 3., 4.)
      else if (line.match(/^([A-D]:|[1-4]\.)/i)) {
        const option = line.replace(/^([A-D]:|[1-4]\.)/i, '').trim();
        if (currentQuestion.options) {
          currentQuestion.options.push(option);
        }
      }
      // Check for correct answer (Answer: or Correct:)
      else if (line.match(/^(Answer:|Correct:)/i)) {
        const answerText = line.replace(/^(Answer:|Correct:)/i, '').trim();
        // Parse answer - could be letter (A-D) or number (0-3 or 1-4)
        let answerIndex = -1;
        
        if (answerText.match(/^[A-D]$/i)) {
          answerIndex = answerText.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        } else if (answerText.match(/^[0-3]$/)) {
          answerIndex = parseInt(answerText);
        } else if (answerText.match(/^[1-4]$/)) {
          answerIndex = parseInt(answerText) - 1;
        } else {
          // Try to match the answer text with options
          if (currentQuestion.options) {
            answerIndex = currentQuestion.options.findIndex(opt => 
              opt.toLowerCase().includes(answerText.toLowerCase()) ||
              answerText.toLowerCase().includes(opt.toLowerCase())
            );
          }
        }
        
        currentQuestion.correctAnswer = answerIndex;
      }
      // Check for category
      else if (line.match(/^(Category:|Topic:)/i)) {
        currentQuestion.category = line.replace(/^(Category:|Topic:)/i, '').trim();
      }
      
      lineIndex++;
    }

    // Add last question if complete
    if (currentQuestion.question && isQuestionComplete(currentQuestion)) {
      questions.push(currentQuestion as Question);
    }

    return questions;
  };

  const isQuestionComplete = (q: Partial<Question>): boolean => {
    return !!(
      q.question &&
      q.options &&
      q.options.length >= 2 &&
      q.correctAnswer !== undefined &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < q.options.length
    );
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    const validTypes = ['text/plain', 'application/json'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
      setError('Please upload a .txt or .json file');
      return;
    }

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let parsedQuestions: Question[];

        if (selectedFile.name.endsWith('.json')) {
          const jsonData = JSON.parse(content);
          parsedQuestions = Array.isArray(jsonData) ? jsonData : jsonData.questions || [];
        } else {
          parsedQuestions = parseQuizFile(content);
        }

        // Validate questions
        const validQuestions = parsedQuestions.filter(isQuestionComplete);
        
        if (validQuestions.length === 0) {
          setError('No valid questions found in the file. Please check the format.');
          setPreview([]);
        } else {
          setPreview(validQuestions);
          if (!quizName) {
            setQuizName(selectedFile.name.replace(/\.(txt|json)$/, ''));
          }
        }
      } catch (err) {
        setError('Error parsing file. Please check the format.');
        setPreview([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!quizName.trim()) {
      setError('Please enter a quiz name');
      return;
    }

    if (preview.length === 0) {
      setError('No valid questions to upload');
      return;
    }

    const newQuizSet: QuizSet = {
      id: `custom-${Date.now()}`,
      name: quizName,
      description: quizDescription || `Custom quiz with ${preview.length} questions`,
      questions: preview,
      difficulty: difficulty,
      estimatedTime: `${Math.ceil(preview.length * 0.75)}-${Math.ceil(preview.length * 1)} minutes`
    };

    onQuizUploaded(newQuizSet);
  };

  return (
    <div className="quiz-upload">
      <div className="upload-header">
        <h2 className="upload-title">📤 Upload Custom Quiz</h2>
        <p className="upload-subtitle">Upload a text or JSON file with quiz questions</p>
      </div>

      <div className="upload-form">
        <div className="form-section">
          <label className="form-label">Quiz Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter quiz name..."
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Enter quiz description..."
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Difficulty Level</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">Upload File *</label>
          <div
            className={`file-drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept=".txt,.json"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />
            <label htmlFor="file-upload" className="file-label">
              <div className="upload-icon">📁</div>
              <p className="upload-text">
                {file ? file.name : 'Drag and drop your quiz file here or click to browse'}
              </p>
              <p className="upload-hint">Supports .txt and .json files</p>
            </label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {preview.length > 0 && (
          <div className="preview-section">
            <h3 className="preview-title">📋 Preview ({preview.length} questions)</h3>
            <div className="preview-questions">
              {preview.slice(0, 3).map((q, index) => (
                <div key={index} className="preview-question">
                  <div className="preview-q-header">
                    <span className="preview-q-number">Q{index + 1}</span>
                    {q.category && <span className="preview-category">{q.category}</span>}
                  </div>
                  <p className="preview-q-text">{q.question}</p>
                  <div className="preview-options">
                    {q.options.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className={`preview-option ${optIndex === q.correctAnswer ? 'correct' : ''}`}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + optIndex)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {preview.length > 3 && (
                <p className="preview-more">... and {preview.length - 3} more questions</p>
              )}
            </div>
          </div>
        )}

        <div className="format-guide">
          <h4 className="guide-title">📖 File Format Guide</h4>
          <div className="guide-content">
            <p className="guide-intro">Your text file should follow this format:</p>
            <pre className="guide-example">{`Q: What is the capital of France?
A: London
B: Paris
C: Berlin
D: Madrid
Answer: B
Category: Geography

Q: Which planet is known as the Red Planet?
1. Venus
2. Mars
3. Jupiter
4. Saturn
Answer: 2
Category: Science`}</pre>
            <p className="guide-note">
              <strong>Note:</strong> You can use Q: or Question: for questions, A-D: or 1-4. for options,
              and Answer: or Correct: for the correct answer (as letter or number).
            </p>
            <div className="template-downloads">
              <a 
                href="/sample-quiz-template.txt" 
                download 
                className="download-link"
              >
                📄 Download Text Template
              </a>
              <a 
                href="/sample-quiz-template.json" 
                download 
                className="download-link"
              >
                📋 Download JSON Template
              </a>
            </div>
          </div>
        </div>

        <div className="upload-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!quizName.trim() || preview.length === 0}
          >
            Upload Quiz ({preview.length} questions)
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizUpload;
