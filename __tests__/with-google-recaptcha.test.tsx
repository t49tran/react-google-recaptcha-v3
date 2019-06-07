import Enzyme from 'enzyme';
import * as React from 'react';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';
import {
  IWithGoogleReCaptchaProps,
  withGoogleReCaptcha
} from 'src/with-google-recaptcha';

const TestComponent = () => <div />;

const WrappedTestComponent = withGoogleReCaptcha(TestComponent);

const TestProvider = () => (
  <GoogleReCaptchaProvider reCaptchaKey="TESTKEY">
    <WrappedTestComponent />
  </GoogleReCaptchaProvider>
);

describe('withGoogleRecaptcha HOC', () => {
  it('inject the wrapped component with googleReCaptcha prop', () => {
    const mountedComponent = Enzyme.mount(<TestProvider />);

    const wrappedComponent = mountedComponent.find(TestComponent);

    expect(wrappedComponent.props()).toHaveProperty('googleReCaptchaProps');

    const googleReCaptchaProps = (wrappedComponent.props() as IWithGoogleReCaptchaProps)
      .googleReCaptchaProps;

    expect(googleReCaptchaProps).toHaveProperty('executeRecaptcha');
  });
});
