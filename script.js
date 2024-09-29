    const questions = [
        {
            question: "Are you currently employed?",
            options: [
                { answer: "Yes, I'm employed full-time.", qualifies: true },
                { answer: "Yes, I'm self-employed.", qualifies: true },
                { answer: "No, I'm currently unemployed.", qualifies: false }
            ]
        },
        {
            question: "What is your gross monthly income?",
            options: [
                { answer: "R8,000 or more.", qualifies: true },
                { answer: "R5,000 to R7,999.", qualifies: true },
                { answer: "R4,999 or less.", qualifies: false }
            ]
        },
        {
            question: "What are your total monthly debt payments?",
            options: [
                { answer: "Less than 30% of my income.", qualifies: true },
                { answer: "30% to 40% of my income.", qualifies: true },
                { answer: "More than 40% of my income.", qualifies: false }
            ]
        }
    ];

    const banks = {
        "Bank1": {},
        "Bank2": {},
        "Bank3": {},
        "Bank4": {},
        "Bank5": {}
    };

    let currentBank = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let visitedBanks = new Set();
    let selectedQuestions = [];

    function showSection(sectionId) {
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
    }

    function getRandomQuestions() {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3); // Select 3 questions
    }

    document.querySelectorAll('.bank').forEach(button => {
        button.addEventListener('click', () => {
            currentBank = button.dataset.bank;
            currentQuestionIndex = 0;
            userAnswers = [];
            visitedBanks.add(currentBank);
            selectedQuestions = getRandomQuestions();
            showSection('eligibility-questions');
            loadQuestions();
        });
    });

    function loadQuestions() {
        const questionContainer = document.querySelector('#eligibility-questions .question-container');
        questionContainer.innerHTML = '';
        document.getElementById('loader').style.display = 'block';

        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';

            if (currentQuestionIndex < selectedQuestions.length) {
                const currentQuestion = selectedQuestions[currentQuestionIndex];
                questionContainer.innerHTML = `
                    <p>${currentQuestion.question}</p>
                    ${currentQuestion.options.map(option => `
                        <button class="option-button" data-qualifies="${option.qualifies}">${option.answer}</button>
                    `).join('')}
                `;
                document.querySelectorAll('.option-button').forEach(button => {
                    button.addEventListener('click', handleAnswer);
                });
            } else {
                checkEligibility();
            }
        }, 1000);
    }

    function handleAnswer() {
        userAnswers.push(this.dataset.qualifies === 'true');
        currentQuestionIndex++;
        loadQuestions();
    }

    function checkEligibility() {
        const correctAnswersCount = userAnswers.filter(answer => answer).length;
        const isEligible = correctAnswersCount >= 2; // Adjust as needed for 3 questions

        if (isEligible) {
            showQualificationAlert();
        } else {
            displayAlert();
        }
    }

    function showAlert(alertId) {
        const alertElement = document.getElementById(alertId);
        alertElement.classList.add('active');
        alertElement.style.display = 'block';
    }

    function showQualificationAlert() {
        const qualificationText = document.getElementById('qualification-text');
        qualificationText.textContent = "Congratulations! You are eligible for a loan.";
        showAlert('qualification-alert');
    }

    document.getElementById('view-nearby-banks').addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(success, error);
    });

    function success(position) {
        document.getElementById('map').style.display = 'block';
        suggestAnotherBank();
    }

    function error() {
        document.getElementById('location-alert').style.display = 'block';
    }

    document.getElementById('enable-location').addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(success, error);
        document.getElementById('location-alert').style.display = 'none';
    });

    document.getElementById('close-location-alert').addEventListener('click', () => {
        document.getElementById('location-alert').style.display = 'none';
    });

    function displayAlert() {
        const alertText = document.getElementById('alert-text');
        const availableBanks = Object.keys(banks).filter(bank => !visitedBanks.has(bank));

        if (availableBanks.length === 0) {
            alertText.textContent = "Oops! You've tried all banks and do not qualify.";
        } else {
            alertText.textContent = `You do not qualify for a loan from ${currentBank}.`;
        }

        showAlert('alert-message');
        suggestAnotherBank();
    }

   function suggestAnotherBank() {
    const availableBanks = Object.keys(banks).filter(bank => !visitedBanks.has(bank));
    const randomBank = availableBanks[Math.floor(Math.random() * availableBanks.length)];
    const suggestBankButton = document.getElementById('suggested-bank');

    if (randomBank) {
        suggestBankButton.textContent = `You can also try ${randomBank}`;
        suggestBankButton.dataset.bank = randomBank;
        suggestBankButton.style.display = 'block';
    } else {
        suggestBankButton.style.display = 'none'; // Hide if no banks available
    }
}

document.getElementById('suggested-bank').addEventListener('click', function() {
    tryAnotherBank(this.dataset.bank);
    this.style.display = 'none'; // Hide the suggestion button after selection
    document.getElementById('alert-message').style.display = 'none'; // Hide the alert
});

    
    function tryAnotherBank(bank) {
        currentBank = bank;
        currentQuestionIndex = 0;
        userAnswers = [];
        visitedBanks.add(currentBank);
        selectedQuestions = getRandomQuestions();
        showSection('eligibility-questions');
        loadQuestions();
    }

    document.getElementById('profile-avatar').addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('close-menu').addEventListener('click', () => {
        document.getElementById('menu').style.display = 'none';
    });

    window.addEventListener('popstate', () => {
        showSection('main');
    });
