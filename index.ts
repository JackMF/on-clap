type OnClapCallBack = () => any;

interface Options {
    ctx?: AudioContext
    sens?: number,
    additionalConditions?: () => boolean,
    repeat?: boolean,
    inputDeviceId?: string 
}

//https://stackoverflow.com/questions/48757933/audiocontext-issue-on-safari?rq=1
declare global {
    interface Window {
      AudioContext: typeof AudioContext;
      webkitAudioContext: typeof AudioContext;
    }
  }

export const onClap = async(
                onClapCallBack: OnClapCallBack,
                options:Options = {}
               ) => {

    const ctx = options.ctx || new AudioContext();
    const inputDeviceId = options.inputDeviceId || "default";
    ctx.resume();

    const mediaOptions = makeUserMediaOptions(inputDeviceId);
    const audioStream = await navigator.mediaDevices.getUserMedia(mediaOptions);
    const audioSourceNode = ctx.createMediaStreamSource(audioStream);

    onClapAudioNode(audioSourceNode, onClapCallBack, options)

}

export const onClapAudioNode = (
                audioNode:AudioNode, 
                onClapCallBack: OnClapCallBack, 
                options:Options) => {

        const ctx = options.ctx || new AudioContext();
        const inputDeviceId = options.inputDeviceId || "default";    
        const sens = options.sens || 1;  
        const additionalConditions = options.additionalConditions || (() =>  true);
        const repeat = options.repeat || false;
        
        ctx.resume()
        const scriptNode = ctx.createScriptProcessor(256, 1, 1);
        scriptNode.onaudioprocess = (event) => {
            const raw = event.inputBuffer.getChannelData(0);
            if (isClap(raw, sens) && additionalConditions()) {
                onClapCallBack();
                if(!repeat) {
                    scriptNode.disconnect();
                    audioNode.disconnect();
                } 

            } 
        }
        audioNode.connect(scriptNode);
        scriptNode.connect(ctx.destination);
}

export const isClap = (rawAudio:Float32Array, sensitivty:number): boolean => {
    return rawAudio.some(
        (rawAudio: number) => {
            return Math.sqrt(rawAudio) >= 0.04 * sensitivty 
        });

}


const makeUserMediaOptions = (inputDeviceId:string):MediaStreamConstraints => {
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


