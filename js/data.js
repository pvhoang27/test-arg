export const exams = [
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
