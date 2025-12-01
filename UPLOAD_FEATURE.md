# Quiz App - Custom Quiz Upload Feature

## Overview
The Quiz App now supports uploading custom quiz questions from text or JSON files. This allows users to create and share their own quizzes easily.

## Supported File Formats

### 1. Text Format (.txt)
The text format supports a simple, human-readable structure:

```
Q: What is the capital of France?
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
Category: Science
```

**Format Rules:**
- Start questions with `Q:` or `Question:`
- Use `A:`, `B:`, `C:`, `D:` OR `1.`, `2.`, `3.`, `4.` for options
- Specify correct answer with `Answer:` or `Correct:` followed by:
  - Letter (A-D) 
  - Number (1-4 or 0-3)
  - Or part of the answer text
- Optionally add `Category:` or `Topic:` to categorize questions
- Separate questions with blank lines

### 2. JSON Format (.json)
The JSON format follows this structure:

```json
[
  {
    "id": 1,
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correctAnswer": 1,
    "category": "Geography"
  },
  {
    "id": 2,
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "correctAnswer": 1,
    "category": "Science"
  }
]
```

**JSON Structure:**
- `id` (number): Question ID
- `question` (string): The question text
- `options` (array): Array of answer options
- `correctAnswer` (number): Index of correct answer (0-based)
- `category` (string, optional): Question category

## How to Upload a Custom Quiz

1. **Navigate to Quiz Selection**: Start the app and enter your name
2. **Click "Upload Custom Quiz"**: Look for the upload button in the quiz selection screen
3. **Fill in Quiz Details**:
   - Quiz Name (required)
   - Description (optional)
   - Difficulty Level (Easy/Medium/Hard)
4. **Upload Your File**:
   - Drag and drop your .txt or .json file
   - Or click to browse and select a file
5. **Preview Questions**: Review the parsed questions to ensure they're correct
6. **Upload**: Click the upload button to add your quiz

## Features

- **Flexible Format**: Supports both text and JSON formats
- **Validation**: Automatically validates questions and shows preview
- **Persistence**: Custom quizzes are saved to localStorage
- **Template Downloads**: Download sample templates to get started
- **Error Handling**: Clear error messages if file format is incorrect

## Sample Templates

Sample quiz templates are available in the `public` folder:
- `sample-quiz-template.txt` - Text format example
- `sample-quiz-template.json` - JSON format example

You can also download these templates from within the app on the upload page.

## Tips for Creating Quizzes

1. **Keep it Clear**: Write questions that are clear and unambiguous
2. **Balanced Options**: Provide 2-4 options per question
3. **Categorize**: Use categories to organize questions by topic
4. **Test First**: Upload a small quiz first to test the format
5. **Varied Difficulty**: Mix easy, medium, and hard questions

## Troubleshooting

**Problem**: Questions not appearing in preview
- **Solution**: Check that your file follows the correct format
- Ensure each question has at least 2 options
- Verify the answer index is valid

**Problem**: File upload rejected
- **Solution**: Make sure file is .txt or .json format
- Check file is not corrupted

**Problem**: Incorrect answers marked as correct
- **Solution**: Verify answer indices are 0-based in JSON
- For text format, ensure answer matches option letter/number

## Technical Details

- Custom quizzes are stored in browser's localStorage
- Maximum practical file size depends on browser localStorage limit (~5-10MB)
- Questions are validated before upload
- Invalid questions are filtered out automatically

## Future Enhancements

Potential features for future versions:
- Export quiz results to file
- Share quizzes via URL
- Import from online sources
- Question difficulty auto-detection
- Multimedia support (images, audio)

---

For more information or issues, please check the main README.md file.
