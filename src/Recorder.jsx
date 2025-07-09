import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa'; // FaPlay is not directly used for button anymore

const Recorder = () => {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null); // Ref for the audio element

  const handleRecord = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunks.current = [];
        setAudioURL(null); // Clear previous audio when starting a new recording

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          // Stop all tracks in the stream to release microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to record your voice.");
      }
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSend = () => {
    if (text.trim() === '' && !audioURL) {
      alert("Please record something or type a message before sending!");
      return;
    }
    // In a real application, you would send the text and/or audioBlob to a server here.
    // For now, we'll just log and reset the state.
    console.log(`Sending text: "${text}"`);
    if (audioURL) {
      console.log("Sending recorded audio:", audioURL);
      // You'd typically send the audioBlob, not the URL
      // fetch('/api/upload-audio', { method: 'POST', body: new Blob(audioChunks.current) });
    }
    alert(`📨 Message sent!`); // More positive feedback
    setText('');
    setAudioURL(null); // Reset after sending
    audioChunks.current = []; // Clear chunks
  };

  return (
    <>
      <button
        onClick={handleRecord}
        className={`record-button ${recording ? 'recording' : ''}`}
      >
        {recording ? <><FaStop /> Stop Recording</> : <><FaMicrophone /> Start Recording</>}
      </button>
      <br />
      <input
        type="text"
        placeholder="💬 Type or edit your message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleSend} className="send-button">
        <FaPaperPlane /> Send Message
      </button>

      {audioURL && (
        <div className="play-area">
          <h3>🔊 Playback Your Recording:</h3>
          <audio controls src={audioURL} ref={audioRef}></audio>
          {/* We're relying on the browser's native audio controls for simplicity and better accessibility */}
        </div>
      )}
    </>
  );
};

export default Recorder;