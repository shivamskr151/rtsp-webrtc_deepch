# RTSPtoWebRTC

RTSP Stream to WebBrowser over WebRTC based on Pion (full native! not using ffmpeg or gstreamer).

**Note:** [RTSPtoWeb](https://github.com/deepch/RTSPtoWeb) is an improved service that provides the same functionality, an improved API, and supports even more protocols. *RTSPtoWeb is recommended over using this service.*


if you need RTSPtoWSMP4f use https://github.com/deepch/RTSPtoWSMP4f


![RTSPtoWebRTC image](doc/demo4.png)

## WebRTC Stream Viewer

The WebRTC Stream Viewer provides a modern, user-friendly interface for viewing real-time video streams from RTSP cameras. The interface features:

- **Clean, modern design** with a purple gradient background
- **Multi-camera support** - view multiple camera streams simultaneously
- **Real-time status indicators** - see connection status for each camera
- **Live timestamps** - displays current date and time on each stream
- **Camera route information** - shows the camera route/identifier on each feed

![WebRTC Stream Viewer](doc/webrtc-stream-viewer.png)

*The WebRTC Stream Viewer showing live feeds from multiple RTSP cameras with connection status, timestamps, and camera route information.*

### Download Source

1. Download source
   ```bash 
   $ git clone https://github.com/deepch/RTSPtoWebRTC  
   ```
3. CD to Directory
   ```bash
    $ cd RTSPtoWebRTC/
   ```
4. Test Run
   ```bash
    $ GO111MODULE=on go run *.go
   ```
5. Open Browser
    ```bash
    open web browser http://127.0.0.1:8083 work chrome, safari, firefox
    ```

## Configuration

### Edit file config.json

format:

```bash
{
  "server": {
    "http_port": ":8083"
  },
  "streams": {
    "demo1": {
      "on_demand" : false,
      "url": "rtsp://170.93.143.139/rtplive/470011e600ef003a004ee33696235daa"
    },
    "demo2": {
      "on_demand" : true,
      "url": "rtsp://admin:admin123@10.128.18.224/mpeg4"
    },
    "demo3": {
      "on_demand" : false,
      "url": "rtsp://170.93.143.139/rtplive/470011e600ef003a004ee33696235daa"
    }
  }
}
```

## Livestreams

Use option ``` "on_demand": false ``` otherwise you will get choppy jerky streams and performance issues when multiple clients connect. 

## Limitations

Video Codecs Supported: H264

Audio Codecs Supported: pcm alaw and pcm mulaw 

## Team

Deepch - https://github.com/deepch streaming developer

Dmitry - https://github.com/vdalex25 web developer

Now test work on (chrome, safari, firefox) no MAC OS

## Other Example

Examples of working with video on golang

- [RTSPtoWeb](https://github.com/deepch/RTSPtoWeb)
- [RTSPtoWebRTC](https://github.com/deepch/RTSPtoWebRTC)
- [RTSPtoWSMP4f](https://github.com/deepch/RTSPtoWSMP4f)
- [RTSPtoImage](https://github.com/deepch/RTSPtoImage)
- [RTSPtoHLS](https://github.com/deepch/RTSPtoHLS)
- [RTSPtoHLSLL](https://github.com/deepch/RTSPtoHLSLL)

[![paypal.me/AndreySemochkin](https://ionicabizau.github.io/badges/paypal.svg)](https://www.paypal.me/AndreySemochkin) - You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
