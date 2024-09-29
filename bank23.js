<script>
        const banks = {
            "Bank1": {
                "questions": [
                    "Question 1 for Bank 1",
                    "Question 2 for Bank 1"
                ]
            },
            "Bank2": {
                "questions": [
                    "Question 1 for Bank 2",
                    "Question 2 for Bank 2"
                ]
            },
            "Bank3": {
                "questions": [
                    "Question 1 for Bank 3",
                    "Question 2 for Bank 3"
                ]
            },
            "Bank4": {
                "questions": [
                    "Question 1 for Bank 4",
                    "Question 2 for Bank 4"
                ]
            },
            "Bank5": {
                "questions": [
                    "Question 1 for Bank 5",
                    "Question 2 for Bank 5"
                ]
            }
        };

        let currentBank = null;
        let currentQuestionIndex = 0;
        let remainingBanks = Object.keys(banks).length;
        const visitedBanks = new Set();

        function showSection(sectionId) {
            const sections = document.querySelectorAll('main section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = 'block';
        }

        const bankButtons = document.querySelectorAll('.bank');
        bankButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentBank = button.dataset.bank;
                visitedBanks.add(currentBank);
                currentQuestionIndex = 0;
                showSection('eligibility-questions');
                loadQuestions();
            });
        });

        function loadQuestions() {
            const questionContainer = document.querySelector('#eligibility-questions .question-container');
            questionContainer.innerHTML = '';

              // Show loader
            document.getElementById('loader').style.display = 'block';

            setTimeout(() => {
                document.getElementById('loader').style.display = 'none'; // Hide loader


            if (currentQuestionIndex < banks[currentBank].questions.length) {
                questionContainer.innerHTML = `
                    <p>${banks[currentBank].questions[currentQuestionIndex]}</p>
                    <button class="next-question">Next Question</button>
                `;

                const nextButton = questionContainer.querySelector('.next-question');
                nextButton.addEventListener('click', () => {
                    currentQuestionIndex++;
                    loadQuestions();
                });
            } else {
                checkEligibility();
            }
        }, 1000); // Wait for 4 seconds
     }

        function checkEligibility() {
            const isEligible = (currentBank === "Bank2"); // Example logic for eligibility

            if (isEligible) {
                document.getElementById('map').style.display = 'block'; // Show map
                alert("Congratulations! You are eligible for a loan.");
                // Here you could implement the logic to show nearby banks on the map
            } else {
                remainingBanks--;
                displayAlert();
            }
        }

        function displayAlert() {
            const alertMessage = document.getElementById('alert-message');
            const alertText = document.getElementById('alert-text');
            alertMessage.style.display = 'block';

            const availableBanks = Object.keys(banks).filter(bank => !visitedBanks.has(bank));
            
            if (availableBanks.length === 0) {
                alertText.textContent = "Oops! You've tried all banks and do not qualify.";
                document.getElementById('remaining-bank-list').innerHTML = '';
            } else {
                alertText.textContent = `You do not qualify for a loan from ${currentBank}.`;
                document.getElementById('remaining-bank-list').innerHTML = `
                    <h3>Try another bank:</h3>
                    <div class="bank-grid">
                        ${availableBanks.map(bank => `
                            <button class="bank" data-bank="${bank}">
                                <img src="${bank.toLowerCase()}.png" alt="${bank} Logo">
                                ${bank}
                            </button>
                        `).join('')}
                    </div>
                `;
                // Add event listeners to the new bank buttons
                document.querySelectorAll('.remaining-bank .bank').forEach(button => {
                    button.addEventListener('click', () => {
                        tryAnotherBank(button.dataset.bank);
                    });
                });
            }
        }

        function tryAnotherBank(bank) {
            currentBank = bank;
            visitedBanks.add(currentBank);
            currentQuestionIndex = 0;
            showSection('eligibility-questions');
            loadQuestions();
            document.getElementById('alert-message').style.display = 'none';
            document.getElementById('map').style.display = 'none'; // Hide map for new selection
        }

        document.getElementById('profile-avatar').addEventListener('click', () => {
            const menu = document.getElementById('menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('close-menu').addEventListener('click', () => {
            document.getElementById('menu').style.display = 'none';
        });

        document.getElementById('feedback-button').addEventListener('click', () => {
            alert('Feedback button clicked!'); // Replace with feedback functionality
        });

        showSection('bank-selection');
    </script>


