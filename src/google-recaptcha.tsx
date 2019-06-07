import * as React from 'react';
import {
  IWithGoogleReCaptchaProps,
  withGoogleReCaptcha
} from './with-google-recaptcha';

export interface IGoogleRecaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
}

class GoogleReCaptcha extends React.Component<IGoogleRecaptchaProps> {
  async componentDidMount() {
    const { googleReCaptchaProps, action, onVerify } = this.injectedProps;

    const { executeRecaptcha } = googleReCaptchaProps;

    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha(action);

    if (!onVerify) {
      return;
    }

    onVerify(token);
  }

  get injectedProps() {
    return this.props as IGoogleRecaptchaProps & IWithGoogleReCaptchaProps;
  }

  render() {
    return null;
  }
}

const WrappedGoogleRecaptcha = withGoogleReCaptcha(GoogleReCaptcha);

export { WrappedGoogleRecaptcha as GoogleReCaptcha };
