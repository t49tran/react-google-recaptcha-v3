import * as React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';
import {
  withGoogleReCaptcha,
  IWithGoogleReCaptchaProps
} from 'src/with-google-recaptcha';

(Enzyme as any).configure({ adapter: new Adapter() });

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
