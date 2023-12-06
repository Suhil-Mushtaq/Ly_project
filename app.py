from flask import Flask, render_template, request
from flask_cors import CORS
import os
import librosa
import numpy as np
from keras.models import load_model

app = Flask(__name__)
CORS(app)
# Load the pre-trained model
loaded_model = load_model('model.h5')

# Function to extract MFCC features from an audio file
def extract_mfcc(filename):
    y, sr = librosa.load(filename, duration=3, offset=0.5)
    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    return mfcc

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    # Get the audio file from the request
    audio_file = request.files['audio']

    # Specify the directory to save the audio file
    save_dir = 'static'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    # Save the audio file locally
    audio_path = os.path.join(save_dir, 'new_audio.wav')
    audio_file.save(audio_path)

    # Extract MFCC features
    new_data, new_sampling_rate = librosa.load(audio_path)
    new_mfcc = extract_mfcc(audio_path)

    new_mfcc = np.expand_dims(new_mfcc, -1)
    new_mfcc = np.expand_dims(new_mfcc, 0)  # Add a batch dimension

    # Make predictions
    predictions = loaded_model.predict(new_mfcc)
    predicted_class = np.argmax(predictions)

    # Define emotion labels
    emotion_labels = ['anger', 'disgust', 'fear', 'happy', 'neutral', 'ps', 'sad']
    recognized_emotion = emotion_labels[predicted_class]

    # Format the output message
    output_message = f"Emotion recognized is: {recognized_emotion}"

    return output_message

if __name__ == '__main__':
    app.run(debug=True)
