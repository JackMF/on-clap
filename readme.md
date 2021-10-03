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
import {onClap} from `on-clap`;
onClap(() => console.log("there was a clap"))              
```

