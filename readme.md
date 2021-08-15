# on-clap [![GitHub issues](https://img.shields.io/github/issues/JackMF/on-clap)](https://github.com/JackMF/on-clap/issues)

Do something when you hear a clap (or any loud noise)

![Alt Text](https://media.giphy.com/media/LD0OalPb8u8Le/giphy.gif)

### Install:

with npm:

```npm i on-clap```

with yarn:

```yarn install on-clap```


### Usage

#### basic usage.

This will ask the user for access to thier microphone as it uses [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

```js
import onClap from `on-clap`;


let data = Array.from({length: 1024}, Math.random)

// create float32 data
let buffer = float(data)

// get float32 remainders
let fractBuffer = fract32(data)

// convert number to float32
let f32 = float32(0.1) // 0.10000000149011612

// get float32 number remainder
let rem32 = fract32(0.1) //
```
