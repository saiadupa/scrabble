from flask import Flask, request, jsonify, render_template
from collections import Counter
import re

app = Flask(__name__)

# Load the valid words from the words.txt file into a list and convert to lowercase
with open('words.txt') as f:
    valid_words = [word.strip().lower() for word in f.read().splitlines() if word.strip()]

def can_form_word(word, pattern, letters):
    letter_counter = Counter(letters.lower())

    # Check if the word matches the pattern and can be formed with the given letters
    for w_char, p_char in zip(word, pattern):
        if p_char in ['_', '?']:
            if letter_counter[w_char] > 0:
                letter_counter[w_char] -= 1
            else:
                return False
        elif w_char != p_char:
            return False
    return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find-words')
def find_words():
    pattern = request.args.get('pattern', '').lower().strip()
    letters = request.args.get('letters', '').lower().strip()

    if not letters or not re.match(r'^[a-zA-Z]{1,7}$', letters):
        return jsonify({'error': 'Please provide up to 7 valid letters.'}), 400

    if not pattern:
        matching_words = [word for word in valid_words if all(Counter(word) <= Counter(letters))]
    else:
        matching_words = [word for word in valid_words if can_form_word(word, pattern, letters)]

    matching_words.sort(key=lambda x: (len(x), x))

    return jsonify({'words': matching_words}) if matching_words else jsonify({'error': 'No matching words found'})

if __name__ == '__main__':
    app.run(debug=True)