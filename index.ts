import {isClap} from './helpers'

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
               sensitivty:number = 1.0,
               additionalConditions:AdditionalConditions = () => true, 
               ctx:AudioContext = new AudioContext(), 
               repeat:boolean=false,
               inputDeviceId:string="default") => {

    const options = makeUserMediaOptions(inputDeviceId)
    ctx.resume()
    const audioStream = await navigator.mediaDevices.getUserMedia(options);
    const audioSourceNode = ctx.createMediaStreamSource(audioStream);
    onClapAudioNode(audioSourceNode, onClapCallBack, sensitivty, additionalConditions, ctx, repeat)

    }


export const onClapAudioNode = (audioSourceNode:MediaStreamAudioSourceNode, 
                onClapCallBack: OnClapCallBack, 
                sensitivty:number = 1.0,
                additionalConditions:AdditionalConditions = () => true, 
                ctx:AudioContext = new AudioContext(), 
                repeat:boolean=false) => {

        ctx.resume()
        const scriptNode = ctx.createScriptProcessor(256, 1, 1);
        scriptNode.onaudioprocess = (event) => {
            const raw = event.inputBuffer.getChannelData(0);
            if (isClap(raw, sensitivty) && additionalConditions()) {
                onClapCallBack()
                if(!repeat) {
                    scriptNode.disconnect()
                } 

            } 
        }
        audioSourceNode.connect(scriptNode);
        scriptNode.connect(ctx.destination);
    }

export default onClap;

