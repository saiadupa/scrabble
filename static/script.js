document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scrabble-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const patternDiv = document.getElementById('pattern');
        const lettersDiv = document.getElementById('letters');
        const errorDiv = document.getElementById('error');
        const resultsDiv = document.getElementById('results');

        const pattern = Array.from(patternDiv.getElementsByClassName('pattern-box')).map(input => input.value || '_').join('');
        const letters = Array.from(lettersDiv.getElementsByClassName('letter-box')).map(input => input.value).join('');

        // Clear previous errors and results
        errorDiv.textContent = '';
        resultsDiv.innerHTML = '';

        if (!letters.match(/^[a-zA-Z]{0,7}$/)) {
            errorDiv.textContent = 'Please provide up to 7 valid letters.';
            return;
        }

        fetch(`/find-words?pattern=${pattern}&letters=${letters}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    errorDiv.textContent = data.error;
                } else {
                    const matchedWords = [];
                    const otherWords = [];

                    // Separate words that exactly match the pattern and others
                    data.words.forEach(word => {
                        if (pattern.split('').every((char, index) => char === '_' || char === '?' || char === word[index])) {
                            matchedWords.push(word);
                        } else {
                            otherWords.push(word);
                        }
                    });

                    // Display the matched words first in green boxes
                    matchedWords.forEach(word => {
                        const wordBox = document.createElement('div');
                        wordBox.className = 'matched-word';

                        for (let i = 0; i < word.length; i++) {
                            const letterSpan = document.createElement('span');
                            if (pattern[i] !== '_' && pattern[i].toLowerCase() === word[i]) {
                                letterSpan.className = 'matched-letter';
                            }
                            letterSpan.textContent = word[i];
                            wordBox.appendChild(letterSpan);
                        }

                        resultsDiv.appendChild(wordBox);
                    });

                    // Display the other words in regular boxes
                    otherWords.forEach(word => {
                        const wordBox = document.createElement('div');
                        wordBox.className = 'other-word';

                        for (let i = 0; i < word.length; i++) {
                            const letterSpan = document.createElement('span');
                            if (pattern[i] !== '_' && pattern[i].toLowerCase() === word[i]) {
                                letterSpan.className = 'matched-letter';
                            }
                            letterSpan.textContent = word[i];
                            wordBox.appendChild(letterSpan);
                        }

                        resultsDiv.appendChild(wordBox);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorDiv.textContent = 'An error occurred. Please try again later.';
            });
    });
});