# on-clap [![GitHub issues](https://img.shields.io/github/issues/JackMF/on-clap)](https://github.com/JackMF/on-clap/issues)

Do something when you hear a clap (or any loud noise)

![Alt Text](https://media.giphy.com/media/LD0OalPb8u8Le/giphy.gif)

## Install:

with npm:

```npm i on-clap```

with yarn:

```yarn install on-clap```


## Usage

### Basic Usage
in its most basic usage you pass a callback function to be called after a clap is heard:

```js
import {onClap} from 'on-clap';
onClap(() => console.log("there was a clap!"))              
```
**Note** this will ask the user for access to thier microphone as it uses [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) under the hood.

### Options
An options object can also be passed to `onClap`:
```js
import {onClap} from 'on-clap';
options = {
    sens: 1.5, // how loud a clap we need to hear to trigger the call back. Bigger is more sensitive. Default = 1
    repeat: false, //If you want on clap to trigger multiple times or only once. Default = false.
    additionalConditions: () => 2 == 2, //A function which returns true if some additional conditions are met. Default = () => true.
    inputDeviceId: "1235a1", //The input device idea we listen to the clap on. Default = "default"
    ctx: someAudioContext, // a pre-existing audio context if we want to use it. Default = new AudioContext().
};

onClap(() => console.log("there was a clap"), options);
```
### Listening for claps on an existing AudioNode
if you have a pre-existing [AudioNode] (https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) you would like to listen for claps you can use
`onClapAudioNode`:
```js
import {onClapAudioNode} from 'on-clap';
onClapAudioNode(someExistingAudioNode, () => console.log("there was a clap"))

```
the above options can also be passed on like in onClap.

```js
...
onClapAudioNode(someExistingAudioNode, () => console.log("there was a clap"), options)

```



