// AnimatedTextGenerator.js
import React from 'react';
import './AnimatedTextGenerator.css'; // Create a new CSS file for styling

function AnimatedTextGenerator() {
  return (
    <div className="animated-text-container">
      <p className="animated-text">
        can <span className="dynamic-text">predict your emotion</span> using audio inputs.
      </p>
    </div>
  );
}

export default AnimatedTextGenerator;
