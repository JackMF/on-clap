

/*
A worklet for recording in sync with AudioContext.currentTime.
More info about the API:
https://developers.google.com/web/updates/2017/12/audio-worklet
How to use:
1. Serve this file from your server (e.g. put it in the "public" folder) as is.
2. Register the worklet:
    const audioContext = new AudioContext();
    audioContext.audioWorklet.addModule('path/to/recorderWorkletProcessor.js')
      .then(() => {
        // your code here
      })
3. Whenever you need to record anything, create a WorkletNode, route the 
audio into it, and schedule the values for 'isRecording' parameter:
      const recorderNode = new window.AudioWorkletNode(
        audioContext,
        'recorder-worklet'
      );
      yourSourceNode.connect(recorderNode);
      recorderNode.connect(audioContext.destination);
      recorderNode.port.onmessage = (e) => {
        if (e.data.eventType === 'data') {
          const audioData = e.data.audioBuffer;
          // process pcm data
        }
        if (e.data.eventType === 'stop') {
          // recording has stopped
        }
      };
      recorderNode.parameters.get('isRecording').setValueAtTime(1, time);
      recorderNode.parameters.get('isRecording').setValueAtTime(
        0,
        time + duration
      );
      yourSourceNode.start(time);
      
*/


const isClap = (rawAudio, sens) => {
  return rawAudio.some(
      (rawAudio) => {
          return Math.sqrt(rawAudio) >= 0.04 * sens 
      });

}

class ClapDetector extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {name: 'sensitivity', defaultValue: 1, minValue: 0, maxValue: 100}
    ];
  }
  constructor() {
    super();
  }
  checkForClap (audioData, sens) {
    if (isClap(audioData, sens)) {
      this.port.postMessage({
        type: 'clap',   
      });
    }
  }
  
  process(inputs, outputs, parameters) {
    const audioData = inputs[0][0]
    if (audioData){
      this.checkForClap(audioData, parameters.sensitivity[0]);  
    }
    return true

  }

}

  
registerProcessor("clapDetector", ClapDetector);
