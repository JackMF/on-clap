

import ClapDetectorNode from './workletnode'

type AdditionalConditions = () => boolean;
type OnClapCallBack = () => void;


//https://stackoverflow.com/questions/48757933/audiocontext-issue-on-safari?rq=1
declare global {
    interface Window {
      AudioContext: typeof AudioContext;
      webkitAudioContext: typeof AudioContext;
    }
  }

const makeUserMediaOptions = (inputDeviceId:string):MediaStreamConstraints =>{
    return {
        "audio": {
            "deviceId":inputDeviceId,
            "autoGainControl": false,
            "echoCancellation":false,
            "noiseSuppression":false
        },
        "video": false
    };
}

const onClap = async(onClapCallBack: OnClapCallBack, 
    sensitivity:number = 1.0,
               additionalConditions:AdditionalConditions = () => true, 
               ctx:AudioContext = new AudioContext(), 
               repeat:boolean=false,
               inputDeviceId:string="default") => {

    const options = makeUserMediaOptions(inputDeviceId)
    const audioStream = await navigator.mediaDevices.getUserMedia(options);
    const audioSourceNode = ctx.createMediaStreamSource(audioStream);
    onClapAudioNode(audioSourceNode, onClapCallBack, sensitivity, additionalConditions, ctx, repeat)

    }

export const onClapAudioNode = async(audioSourceNode:MediaStreamAudioSourceNode, 
            onClapCallBack: OnClapCallBack, 
            sensitivity:number = 1.0,
            additionalConditions:AdditionalConditions = () => true, 
            ctx:AudioContext = new AudioContext(), 
            repeat:boolean=false) => {

        ctx.resume()
        await ctx.audioWorklet.addModule("audio_worklet.js")
        const clapDetectorNode = new ClapDetectorNode(ctx);
        
        let sensitivityParam = clapDetectorNode.parameters.get("sensitivity");
        sensitivityParam.setValueAtTime(sensitivity, ctx.currentTime);
        clapDetectorNode.port.onmessage = (e) => {
            if (e.data.type === "clap" && additionalConditions()) {
                onClapCallBack()
                if(!repeat) {
                    clapDetectorNode.disconnect()
                } 
            }            

        }
        audioSourceNode.connect(clapDetectorNode);
        clapDetectorNode.connect(ctx.destination);
    }

export default onClap;

