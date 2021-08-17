
export default class ClapDetectorNode extends window.AudioWorkletNode {
    constructor(context) {
      super(context, 'clapDetector');
    }
  }
