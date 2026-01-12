// Data
const exams = [
    {
        id: 'exam-1',
        title: 'General English Level A1',
        description: 'Basic vocabulary and grammar for beginners. Perfect for starting your journey.',
        questions: 10,
        time: 15, // minutes
        data: [
            {
                id: 1,
                question: "Which sentence is correct?",
                options: ["She don't like apples.", "She doesn't like apples.", "She not like apples.", "She no like apples."],
                correct: 1, // Index
                explanation: "In Present Simple, we use 'does not' (doesn't) for the third person singular (She/He/It)."
            },
            {
                id: 2,
                question: "I _____ to the cinema yesterday.",
                options: ["go", "gone", "went", "going"],
                correct: 2,
                explanation: "The sentence is in the Past Simple tense (yesterday), so we use the past form of 'go', which is 'went'."
            },
            {
                id: 3,
                question: "What is the plural of 'child'?",
                options: ["childs", "children", "childrens", "childes"],
                correct: 1,
                explanation: "'Child' is an irregular noun. Its plural form is 'children'."
            },
            {
                id: 4,
                question: "Where _____ you live?",
                options: ["are", "is", "do", "does"],
                correct: 2,
                explanation: "We use the auxiliary verb 'do' for questions with 'you' in the Present Simple."
            },
            {
                id: 5,
                question: "My brother is _____ than me.",
                options: ["tall", "taller", "more tall", "tallest"],
                correct: 1,
                explanation: "For short adjectives like 'tall', we add '-er' to form the comparative."
            }
        ]
    },
    {
        id: 'exam-2',
        title: 'TOEIC Vocabulary',
        description: 'Business English vocabulary focused on office environments and meetings.',
        questions: 10,
        time: 20,
        data: [
            {
                id: 1,
                question: "The meeting has been _____ until next Monday.",
                options: ["postponed", "cancelled", "started", "ended"],
                correct: 0,
                explanation: "'Postponed' means to arrange for something to take place at a time later than that first scheduled."
            },
            {
                id: 2,
                question: "Please _____ the attached document.",
                options: ["review", "watch", "look", "see"],
                correct: 0,
                explanation: "'Review' is the most appropriate professional term for checking or examining a document."
            },
            {
                id: 3,
                question: "We need to hire a new _____ for the accounting department.",
                options: ["employ", "employee", "employment", "employer"],
                correct: 1,
                explanation: "We need a noun referring to a person here. 'Employee' is the person being hired."
            }
        ]
    }
];

// App Logic
class App {
    constructor() {
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {}; // { questionId: optionIndex }
        this.timerInterval = null;
        this.timeRemaining = 0;

        this.views = {
            home: document.getElementById('home'),
            quiz: document.getElementById('quiz'),
            result: document.getElementById('result'),
            review: document.getElementById('review'),
            history: document.getElementById('history')
        };

        this.init();
    }

    init() {
        this.renderExamList();
    }

    navigate(viewName) {
        // Hide all views
        Object.values(this.views).forEach(el => el.classList.remove('active'));

        // Show target view
        if (this.views[viewName]) {
            this.views[viewName].classList.add('active');
            this.views[viewName].classList.add('animate-fade-in');
        }

        // Reset scroll
        window.scrollTo(0, 0);
    }

    saveResult(examId, score, total) {
        const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
        const examTitle = exams.find(e => e.id === examId)?.title || 'Unknown Exam';

        history.unshift({
            examTitle,
            score,
            total,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            })
        });

        // Keep last 10 records
        if (history.length > 10) history.pop();

        localStorage.setItem('examHistory', JSON.stringify(history));
    }

    showHistory() {
        const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
        const container = document.getElementById('history-list');

        if (history.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-muted);">No history yet. Take a quiz!</p>`;
        } else {
            container.innerHTML = history.map(item => {
                const percentage = Math.round((item.score / item.total) * 100);
                const color = percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--primary)' : 'var(--error)';

                return `
                <div class="exam-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${item.examTitle}</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">${item.date}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: block; font-size: 1.5rem; font-weight: bold; color: ${color};">${percentage}%</span>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">${item.score}/${item.total}</span>
                    </div>
                </div>
            `}).join('');
        }

        this.navigate('history');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your history?')) {
            localStorage.removeItem('examHistory');
            this.showHistory();
        }
    }

    renderExamList() {
        const container = document.getElementById('exams-list');
        container.innerHTML = exams.map(exam => `
            <div class="exam-card">
                <span class="exam-tag">${exam.questions} Questions</span>
                <h3>${exam.title}</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${exam.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.875rem; color: var(--text-muted);">⏱ ${exam.time} mins</span>
                    <button class="btn btn-primary" onclick="app.startExam('${exam.id}')">Start Quiz</button>
                </div>
            </div>
        `).join('');
    }

    startExam(examId) {
        this.currentExam = exams.find(e => e.id === examId);
        if (!this.currentExam) return;

        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.timeRemaining = this.currentExam.time * 60;

        document.getElementById('quiz-title').textContent = this.currentExam.title;

        this.startTimer();
        this.renderQuestion();
        this.navigate('quiz');
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const updateTimerDisplay = () => {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            document.getElementById('timer').textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.finishExam();
            }
        }, 1000);
    }

    renderQuestion() {
        const question = this.currentExam.data[this.currentQuestionIndex];
        const total = this.currentExam.data.length;

        document.getElementById('question-tracker').textContent = `Question ${this.currentQuestionIndex + 1}/${total}`;
        document.getElementById('question-text').textContent = question.question;

        const optionsHtml = question.options.map((opt, idx) => {
            const isSelected = this.userAnswers[this.currentQuestionIndex] === idx;
            return `
                <div class="option-btn ${isSelected ? 'selected' : ''}" 
                     onclick="app.selectAnswer(${idx})">
                    <span style="font-weight: bold; margin-right: 0.5rem;">${String.fromCharCode(65 + idx)}.</span>
                    ${opt}
                </div>
            `;
        }).join('');

        document.getElementById('options-list').innerHTML = optionsHtml;

        // Button states
        document.getElementById('btn-prev').style.visibility = this.currentQuestionIndex === 0 ? 'hidden' : 'visible';
        document.getElementById('btn-next').textContent = this.currentQuestionIndex === total - 1 ? 'Finish' : 'Next';
    }

    selectAnswer(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        this.renderQuestion(); // Re-render to update selected state
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentExam.data.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        } else {
            this.finishExam();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    }

    finishExam() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        let score = 0;
        this.currentExam.data.forEach((q, idx) => {
            if (this.userAnswers[idx] === q.correct) {
                score++;
            }
        });

        const percentage = Math.round((score / this.currentExam.data.length) * 100);

        document.getElementById('score-display').textContent = `${percentage}%`;
        document.getElementById('score-message').textContent =
            percentage >= 80 ? 'Excellent work!' :
                percentage >= 50 ? 'Good effort!' : 'Keep practicing!';

        this.saveResult(this.currentExam.id, score, this.currentExam.data.length);

        this.navigate('result');
    }

    reviewExam() {
        const container = document.getElementById('review-list');
        container.innerHTML = this.currentExam.data.map((q, idx) => {
            const userAnswer = this.userAnswers[idx];
            const isCorrect = userAnswer === q.correct;
            // const userOptionLabel = userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) : '-'; // Unused

            return `
                <div class="question-card" style="border-left: 5px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}">
                    <h3 style="margin-bottom: 1rem;">${idx + 1}. ${q.question}</h3>
                    
                    <div style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem;">
                        ${q.options.map((opt, optIdx) => {
                let style = 'padding: 0.5rem; border-radius: var(--radius-md); border: 1px solid transparent; opacity: 0.7;';
                if (optIdx === q.correct) style = 'background: rgba(34, 197, 94, 0.1); border-color: var(--success); opacity: 1; font-weight: bold;';
                else if (optIdx === userAnswer && !isCorrect) style = 'background: rgba(239, 68, 68, 0.1); border-color: var(--error); opacity: 1;';

                return `<div style="${style}">${String.fromCharCode(65 + optIdx)}. ${opt}</div>`;
            }).join('')}
                    </div>

                    <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md);">
                        <p style="color: var(--success); font-weight: bold; margin-bottom: 0.25rem;">Explanation:</p>
                        <p style="color: var(--text-muted);">${q.explanation || 'No explanation available.'}</p>
                    </div>
                </div>
            `;
        }).join('');

        this.navigate('review');
    }
}

// Initialize app and make it global for onclick handlers
window.app = new App();
