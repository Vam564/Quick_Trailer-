import React,{useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@material-ui/icons/Mic';
import IconButton from '@material-ui/core/IconButton';


const SpeechRecognitionGrasper = () => {
  const [message, setMessage] = useState('')
  const commands = [
    {
      command: '*',
      callback: (movie) => setMessage(`Your search is for : ${movie}`)
    },
  ]
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({commands});
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleMicOn = () => {
    SpeechRecognition.startListening()
    setInterval(() => {
      SpeechRecognition.stopListening()
      resetTranscript()
    }, 5000);
  }


  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <IconButton aria-label="Home" color="inherit" onClick={handleMicOn} >
        <MicIcon />
      </IconButton>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <p>{message}</p>
    </div>
  );
};
export default SpeechRecognitionGrasper;