// App.js
import React, { useState } from 'react';
import axios from 'axios';
import { ReactMic } from 'react-mic';
import useRecorder from './useRecorder';

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

  return (
    <div>
      <h1>Emotion Recognition App</h1>
      <div>
        <label>Record Audio:</label>
        <button onClick={onRecordStart}>
          Start
        </button>
        <button onClick={onRecordStop}>
          Stop
        </button>
      </div>
      {<ReactMic record={recording} onStop={onRecordStop} />}
      {audioBlob && <p>Audio recorded successfully!</p>}
      <div>
        <label>
          Choose File:
          <input type="file" onChange={(event) => setSelectedFile(event.target.files[0])} />
        </label>
      </div>
      <button onClick={onPredictClick}>Predict Emotion</button>
      {emotionResult && <p>{emotionResult}</p>}
    </div>
  );
}

export default App;
