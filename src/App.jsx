import React, { useEffect } from 'react';
import Recorder from './Recorder';
import './index.css';

const App = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const move = (e) => {
      requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
    };

    const mouseDown = () => {
      cursor.classList.add('active'); // Add active class on mouse down
    };

    const mouseUp = () => {
      cursor.classList.remove('active'); // Remove active class on mouse up
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      cursor.remove();
    };
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>🎙️ Voice Cloner</h2>
        <p>
          Capture your unique sound.
          <br />
          <strong>Record</strong>, <strong>transcribe</strong>, and <strong>listen</strong> to your voice transformed.
        </p>
        <Recorder />
      </div>
    </div>
  );
};

export default App;