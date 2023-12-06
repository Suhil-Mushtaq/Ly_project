import React, { useState } from 'react';
import axios from 'axios';
import { ReactMic } from 'react-mic';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [record, setRecord] = useState(false);
  const [emotionResult, setEmotionResult] = useState('');

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setRecord(false); // Stop recording if it's in progress
  };

  const onRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setRecord(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const onRecordStop = (recordedBlob) => {
    setRecord(false);
    setAudioBlob(recordedBlob.blob);
  };

  const onPredictClick = async () => {
    const formData = new FormData();
    
    if (audioBlob) {
      formData.append('audio', audioBlob, 'recorded_audio.wav');
    } else if (selectedFile) {
      formData.append('audio', selectedFile);
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
        <label>
          Choose File:
          <input type="file" onChange={onFileChange} />
        </label>
      </div>
      <div>
        <label>Record Audio:</label>
        <button onClick={onRecordStart} disabled={record}>
          Start
        </button>
        <button onClick={onRecordStop} disabled={!record}>
          Stop
        </button>
      </div>
      {record && <ReactMic record={record} onStop={onRecordStop} />}
      {audioBlob && <p>Audio recorded successfully!</p>}
      <button onClick={onPredictClick}>Predict Emotion</button>
      {emotionResult && <p>{emotionResult}</p>}
    </div>
  );
}

export default App;
