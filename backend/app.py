from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import json

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('model.h5')

# Load the tokenizer
with open('tokenizer.json') as f:
    tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(json.load(f))

max_length = 50  # Set this to the max_length used during training

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_text = data['input_text']
    for _ in range(6):  # Generate 6 words as an example
        token_list = tokenizer.texts_to_sequences([input_text])[0]
        token_list = tf.keras.preprocessing.sequence.pad_sequences([token_list], maxlen=max_length-1, padding='pre')
        predicted = np.argmax(model.predict(token_list), axis=-1)
        output_word = ""
        for word, index in tokenizer.word_index.items():
            if index == predicted:
                output_word = word
                break
        input_text += " " + output_word
    return jsonify({'generated_text': input_text})

if __name__ == '__main__':
    app.run(debug=True)
