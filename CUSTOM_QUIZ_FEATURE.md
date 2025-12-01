# Quiz App - Custom Quiz Upload Feature

## 🎉 New Feature Added!

I've successfully added the ability to upload custom quiz questions from text or JSON files to your Quiz App!

## ✨ What's New

### 1. **Quiz Upload Component**
- New upload interface accessible from the quiz selection screen
- Drag-and-drop file upload support
- Real-time question preview
- File format validation

### 2. **Supported File Formats**

#### Text Format (.txt)
```
Q: What is the capital of France?
A: London
B: Paris
C: Berlin
D: Madrid
Answer: B
Category: Geography
```

#### JSON Format (.json)
```json
{
  "id": 1,
  "question": "What is the capital of France?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "correctAnswer": 1,
  "category": "Geography"
}
```

### 3. **Sample Templates**
Two template files are provided in the `public` folder:
- `sample-quiz-template.txt` - Text format example with 5 questions
- `sample-quiz-template.json` - JSON format example with 5 questions

You can download these directly from the upload page!

## 🚀 How to Use

1. **Start the App** - Enter your participant name
2. **Click "Upload Custom Quiz"** - Button in the quiz selection screen
3. **Fill in Details**:
   - Quiz Name (required)
   - Description (optional)
   - Difficulty Level (Easy/Medium/Hard)
4. **Upload File** - Drag & drop or click to browse
5. **Preview & Confirm** - Review parsed questions
6. **Start Quiz** - Your custom quiz is now available!

## 📝 File Format Guidelines

### Text Format Rules:
- Start questions with `Q:` or `Question:`
- Options: `A:`, `B:`, `C:`, `D:` OR `1.`, `2.`, `3.`, `4.`
- Answer: `Answer:` or `Correct:` followed by letter (A-D) or number (1-4)
- Category: `Category:` or `Topic:` (optional)
- Separate questions with blank lines

### JSON Format Rules:
- Array of question objects
- Required fields: `id`, `question`, `options`, `correctAnswer`
- Optional fields: `category`
- `correctAnswer` is 0-based index

## 💾 Persistence

- Custom quizzes are saved to browser localStorage
- Persist across browser sessions
- Available until you clear browser data

## 🎨 Features

✅ **Drag & Drop Upload** - Easy file upload  
✅ **Format Validation** - Automatic validation  
✅ **Live Preview** - See questions before uploading  
✅ **Error Handling** - Clear error messages  
✅ **Template Downloads** - Get started quickly  
✅ **Multiple Formats** - Text or JSON support  
✅ **Persistent Storage** - Quizzes saved locally  
✅ **Animations** - Smooth UI transitions  

## 📂 Files Created/Modified

### New Files:
1. `src/QuizUpload.tsx` - Upload component
2. `public/sample-quiz-template.txt` - Text template
3. `public/sample-quiz-template.json` - JSON template
4. `UPLOAD_FEATURE.md` - Detailed documentation

### Modified Files:
1. `src/App.tsx` - Added upload view and handlers
2. `src/App.css` - Upload component styling
3. `src/QuizSelection.tsx` - Added upload button
4. `src/types.ts` - Updated AppState type

## 🎯 Example Usage

### Create a Custom Quiz:

1. Create a text file `my-quiz.txt`:
```
Q: What is React?
A: A programming language
B: A JavaScript library
C: A database
D: An operating system
Answer: B
Category: Technology

Q: What does JSX stand for?
1. JavaScript XML
2. Java Syntax Extension
3. JSON Extension
4. JavaScript Extra
Answer: 1
Category: Technology
```

2. Upload the file through the app
3. Fill in quiz details:
   - Name: "React Basics Quiz"
   - Description: "Test your React knowledge"
   - Difficulty: "Medium"
4. Review preview
5. Click "Upload Quiz"
6. Start taking your custom quiz!

## 🔍 Validation

The app validates:
- File format (must be .txt or .json)
- Question structure (must have question text, options, answer)
- Answer validity (must match one of the options)
- Minimum options (at least 2 per question)

## 🎨 UI Enhancements

- **Animated upload interface** with smooth transitions
- **Color-coded preview** showing correct answers
- **Responsive design** works on mobile and desktop
- **Drag & drop zone** with visual feedback
- **Error messages** with helpful guidance

## 🐛 Error Handling

Common errors and solutions:
- **"No valid questions found"** - Check file format matches template
- **"Please upload .txt or .json file"** - Use correct file type
- **"Please enter a quiz name"** - Quiz name is required
- **Preview shows fewer questions** - Some questions invalid, check format

## 🎓 Tips

1. **Start Small** - Test with 3-5 questions first
2. **Use Templates** - Download and modify sample templates
3. **Categories** - Organize questions by topic
4. **Test Format** - Validate one question before creating many
5. **Balanced Options** - Use 4 options for best experience

## 🚀 Running the App

The app is currently starting on your system. Once loaded:
1. Open browser to http://localhost:3000
2. Enter participant name
3. Click "Upload Custom Quiz"
4. Try uploading the sample templates!

---

**Enjoy creating and sharing custom quizzes!** 🎊
