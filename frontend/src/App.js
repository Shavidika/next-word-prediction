import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');

  const handleTyping = async (text) => {
    if (text.trim().length === 0) {
      setSuggestedText('');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', { input_text: text });
      setSuggestedText(response.data.generated_text.substring(text.length));
    } catch (error) {
      console.error('Error generating text', error);
    }
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    // Check if the last character is a space or enter
    if (text.endsWith(' ') || e.nativeEvent.inputType === 'insertParagraph') {
      handleTyping(text);
    } else {
      setSuggestedText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestedText) {
      e.preventDefault();
      setInputText((prevText) => prevText + suggestedText);
      setSuggestedText('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text Generation using Trained Model</h1>
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="input-text"
            rows="10"
            placeholder="Type here..."
          />
          <div className="suggestion-text">
            {inputText}
            <span className="suggestion">{suggestedText}</span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
