// App.js
import React, { useState } from 'react';
import axios from 'axios';
import { ReactMic } from 'react-mic';
import useRecorder from './useRecorder';
import './App.css'; // Import your CSS file for styling

function App() {
  const { startRecording, stopRecording, getBlob, recording } = useRecorder();
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [emotionResult, setEmotionResult] = useState('');

  const onRecordStart = () => {
    startRecording();
  };

  const onRecordStop = () => {
    stopRecording();
    const audioBlob = getBlob();
    setAudioBlob(audioBlob);

    // Create Object URL
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(url);
      audioElement.play();
    }
  };

  const onPredictClick = async () => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append('audio', selectedFile);
    } else {
      formData.append('audio', getBlob(), 'temp.wav');
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict_emotion', formData);
      setEmotionResult(response.data);
    } catch (error) {
      console.error('Error predicting emotion:', error);
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <span className="logo" onClick={reloadPage}>
            <span className="mood">MOOD</span><span className="sonic">SONIC</span>
          </span>
        </div>
        <div className="navbar-options">
          <a href="#">Feedback</a>
          <a href="#">About</a>
        </div>
      </div>
      <div class="grid-container">
      <div className="app-container">
        <h1 className="record-audio-text">Record Audio:</h1>
        <ReactMic record={recording} onStop={onRecordStop} />
        <div className="button-container">
          <button className="start-button" onClick={onRecordStart}>Start</button>
          <button className="stop-button" onClick={onRecordStop}>Stop</button>
        </div>
        {audioBlob && <p>Audio recorded successfully!</p>}

        <div className="or-text">
          <p>OR</p>
        </div>
        <div className="input-container">
          <label>
            Choose File:

            </label>
            <div className="upload-file">
            <input type="file" onChange={(event) => setSelectedFile(event.target.files[0])} />
            </div>
        </div>
        <button className="predict-button" onClick={onPredictClick}>Predict Emotion</button>
        {emotionResult && <div className="result"><p>{emotionResult}</p></div>}
      </div>
      
    <div className="text-gen">
    <body>
    <div class="animated-text">
        Can <span></span>
    </div>
    </body>
    </div>
    
    </div>
    
    </div>

  
  );
}

export default App;
