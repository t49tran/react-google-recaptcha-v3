import React, { Component } from 'react';
import {
  IWithGoogleReCaptchaProps,
  withGoogleReCaptcha
} from '../src/with-google-recaptcha';

class ReCaptchaComponent extends Component<{}, { token?: string }> {
  constructor(props: {}) {
    super(props);

    this.state = { token: undefined };
  }

  handleVerifyRecaptcha = async () => {
    const { executeRecaptcha } = (this.props as IWithGoogleReCaptchaProps)
      .googleReCaptchaProps;

    if (!executeRecaptcha) {
      console.log('Recaptcha has not been loaded');

      return;
    }

    const token = await executeRecaptcha('homepage');

    this.setState({ token });
  };

  render() {
    const { token } = this.state;
    return (
      <div>
        <h3>With Google Recaptcha HOC Example</h3>
        <button onClick={this.handleVerifyRecaptcha}>Verify Recaptcha</button>
        <p>Token: {token}</p>
      </div>
    );
  }
}

export const WithGoogleRecaptchaExample =
  withGoogleReCaptcha(ReCaptchaComponent);
