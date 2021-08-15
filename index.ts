import {isClap} from './helpers'

type AdditionalConditions = () => boolean;
type OnClapCallBack = () => void;

const onClap = (audioSourceNode:MediaStreamAudioSourceNode, 
                onClapCallBack: OnClapCallBack, 
                sensitivty:number = 1.0,
                additionalConditions:AdditionalConditions = () => true, 
                ctx:AudioContext = new AudioContext(), 
                repeat:boolean=false) => {

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
