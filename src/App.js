import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import avatar from './assets/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState('idle');
  
  const audioRef = useRef(null);
  const ringtone = process.env.PUBLIC_URL + '/aria.wav';

  useEffect(() => {
    if (callStatus === 'inCall' && !audioRef.current) {
        audioRef.current = new Audio(ringtone);
        
        // Attach an 'ended' event listener to hang up the call when audio completes.
        audioRef.current.addEventListener('ended', () => {
            setCallStatus('idle');
        });

        audioRef.current.play()
            .catch(error => {
                console.error("There was an error playing the audio:", error);
            });
    } else if (callStatus === 'idle' && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to start
        audioRef.current = null;
    }
}, [callStatus, ringtone]);

  const toggleMicrophone = () => {
    setIsMicrophoneMuted(!isMicrophoneMuted);
  };

  const toggleCall = () => {
    if (callStatus === 'inCall') {
      setCallStatus('idle');
      setIsVideoEnabled(true);
    } else if (callStatus === 'idle') {
      setCallStatus('calling');
      setTimeout(() => {
        setCallStatus('inCall');
      }, 5000);
    }
  };

  const getCallText = () => {
    switch(callStatus) {
      case 'calling': return 'Calling...';
      case 'inCall': return 'In call with ARIA';
      default: return 'Call ARIA';
    }
  };

  const getCallButtonClass = () => {
    return (callStatus === 'calling' || callStatus === 'inCall') ? 'end-btn' : 'call-btn';
  };

  return (
    <div className="app-container">
      <div className="avatar-container">
        <img src={avatar} alt="User Avatar" className="avatar blurred" />
      </div>
      <span className="call-text">{getCallText()}</span>
      <div className="call-actions">
        <div className={`action-btn icon disabled`} 
             style={{ cursor: 'not-allowed', opacity: 0.5 }}>
          <FontAwesomeIcon icon={faVideo} />
        </div>
        <div className={`action-btn ${getCallButtonClass()}`} onClick={toggleCall}>
          <FontAwesomeIcon icon={faPhone} className='icon'/>
        </div>
        <div className={`action-btn microphone ${isMicrophoneMuted ? 'muted' : ''}`} onClick={toggleMicrophone}>
          <FontAwesomeIcon icon={isMicrophoneMuted ? faMicrophoneSlash : faMicrophone} className='icon'/>
        </div>
      </div>
    </div>
  );
}

export default App;
