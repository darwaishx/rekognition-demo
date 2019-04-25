import React, { Component } from 'react';

import Dropzone from './Dropzone';
import Selfie from './Selfie';
import Button from './Button';

import s from './FilePicker.module.css';

class FilePicker extends Component {
  state = {};

  onSubmit = (files) => {
    this.props.onImage([].slice.call(files));
  }

  onFilePicked = e => {
    this.onSubmit(e.target.files);
    e.target.value = null;
  }

  onSelfie = blob => {
    this.setState({ selfie: false });
    this.onSubmit([ blob ]);
  }

  takeSelfie = () => {
    this.setState({
      selfie: true
    });
  }

  componentDidMount() {
    let md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) {
      this.setState({ canSelfie: false });
    } else {
      md.enumerateDevices().then(devices => {
        this.setState({ canSelfie: devices.some(device => 'videoinput' === device.kind) });
      })
    }
  }

  render() {
    return (
      <div className={s.base}>
        <span>Drop an image here</span>
        <span>or</span>
        <Button Component="label">
          Choose an image

          <input
            multiple={this.props.multi}
            type="file"
            accept={[ '.jpg', '.jpeg', '.png', this.props.csv && '.csv' ].filter(Boolean).join(',')}
            onChange={this.onFilePicked}
          />
        </Button>
        { this.state.canSelfie ? <>
          <span>or</span>
          <Button danger onClick={this.takeSelfie}>Take a selfie</Button>
        </> : null}
        <Dropzone
          message={"Drop images here..."}
          onDrop={this.onSubmit}
        />
        {this.state.selfie ?
          <Selfie onCapture={this.onSelfie} />
        :null}
      </div>
    )
  }
}

export default FilePicker;
