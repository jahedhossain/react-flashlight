import React, { useState } from "react";
import "./App.css";

function App() {
  const { torch, setTorch } = useState(true);

  const handleTorch = () => {
    //Test browser support
    const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;
    if (SUPPORTS_MEDIA_DEVICES) {
      //Get the environment camera (usually the second one)
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );
        if (cameras.length === 0) {
          alert("No camera found on this device.");
          return;
        }
        const camera = cameras[cameras.length - 1];
        // Create stream and get video track
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: camera.deviceId,
              facingMode: ["user", "environment"],
              height: { ideal: 1080 },
              width: { ideal: 1920 },
            },
          })
          .then((stream) => {
            const track = stream.getVideoTracks()[0];
            //Create image capture object and get camera capabilities
            const imageCapture = new ImageCapture(track);
            imageCapture.getPhotoCapabilities().then(() => {
              //todo: check if camera has a torch
              //let there be light!
              if (torch) {
                track.applyConstraints({
                  advanced: [{ torch: true }],
                });
                setTorch(false);
              } else {
                track.applyConstraints({
                  advanced: [{ torch: false }],
                });
                setTorch(true);
              }
            });
          });
      });
      //The light will be on as long the track exists
    } else {
      alert("not support");
    }
  };

  return (
    <div className="App">
      <button className="switch" onClick={handleTorch}>
        On / Off
      </button>
    </div>
  );
}

export default App;
