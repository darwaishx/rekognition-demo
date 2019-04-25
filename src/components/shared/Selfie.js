import React, { Component } from 'react';

import Button from './Button';

import s from './Selfie.module.css';

function start(onsuccess, onerror) {
  const config = {
    video: { facingMode: 'user' }
  };

  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia(config)
      .then(onsuccess, onerror)
  } else {
    const gUM = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || navigator.oGetUserMedia;

    if (gUM) {
      gUM.call(navigator, config, onsuccess, onerror);
    } else {
      onerror('unsupported');
    }
  }
}

export default class Selfie extends Component {
  componentDidMount() {
    start(this.onsuccess, this.onerror)
  }

  componentWillUnmount() {
    if (this.stream) this.stream.getTracks()[0].stop();
  }

  onsuccess = (stream) => {
    this.stream = stream;
    this.vid.srcObject = stream;
    this.vid.onloadedmetadata = (e) => {
      this.vid.play();
    };
  }

  onerror = (e) => {
    console.log('NOPE', e)
  }

  capture = () => {
    const cnv = document.createElement('canvas');
    cnv.width = this.vid.videoWidth;
    cnv.height = this.vid.videoHeight;

    const ctx = cnv.getContext('2d');

    // flippingtons
    ctx.scale(-1, 1);
    ctx.drawImage(this.vid, -cnv.width, 0);

    cnv.toBlob(blob => {
      this.props.onCapture(blob);
    }, 'image/jpeg');
  }

  render() {
    return (
      <div className={s.base}>
        <div>
          <video
            playsInline
            autoPlay
            ref={r => {
              this.vid = r;
            }}
          />
        </div>
        <Button danger round onClick={this.capture}>
          <svg width="40px" height="40px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.29289322,6.70710678 L8.70710678,6.29289322 L9.12972943,5.52015851 C9.30513077,5.19944994 9.64154445,5 10.0070846,5 L13.9929154,5 C14.3584555,5 14.6948692,5.19944994 14.8702706,5.52015851 L15.2928932,6.29289322 L15.7071068,6.70710678 C15.8946432,6.89464316 16.1489971,7 16.4142136,7 L19,7 C20.1045695,7 21,7.8954305 21,9 L21,16 C21,17.1045695 20.1045695,18 19,18 L5,18 C3.8954305,18 3,17.1045695 3,16 L3,9 C3,7.8954305 3.8954305,7 5,7 L7.58578644,7 C7.85100293,7 8.10535684,6.89464316 8.29289322,6.70710678 Z M12,17 C14.7614237,17 17,14.7614237 17,12 C17,9.23857625 14.7614237,7 12,7 C9.23857625,7 7,9.23857625 7,12 C7,14.7614237 9.23857625,17 12,17 Z M12,16 C9.790861,16 8,14.209139 8,12 C8,9.790861 9.790861,8 12,8 C14.209139,8 16,9.790861 16,12 C16,14.209139 14.209139,16 12,16 Z M14.9995929,12.0499265 C14.999864,12.0333168 15,12.0166743 15,12 C15,10.3431458 13.6568542,9 12,9 L12,10 C13.1045695,10 14,10.8954305 14,12 L14.5,12 C14.6710891,12 14.8381642,12.0171862 14.9995929,12.0499265 Z M5.5,5 L7.5,5 C7.77614237,5 8,5.22385763 8,5.5 C8,5.77614237 7.77614237,6 7.5,6 L5.5,6 C5.22385763,6 5,5.77614237 5,5.5 C5,5.22385763 5.22385763,5 5.5,5 Z" fill="#FFFFFF" />
          </svg>
        </Button>
      </div>
    )
  }
}
