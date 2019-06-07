import Enzyme from 'enzyme';
import * as React from 'react';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';
import { useGoogleReCaptcha } from 'src/use-google-recaptcha';
import { IWithGoogleReCaptchaProps } from 'src/with-google-recaptcha';

const TestComponent: React.FunctionComponent<
  IWithGoogleReCaptchaProps
> = () => {
  return <div />;
};

const TestProvider = () => {
  const googleReCaptchaProps = useGoogleReCaptcha();
  return <TestComponent googleReCaptchaProps={googleReCaptchaProps} />;
};

describe('useGoogleReCaptcha hook', () => {
  it('return google recaptcha context value', () => {
    const mountedComponent = Enzyme.mount(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY">
        <TestProvider />
      </GoogleReCaptchaProvider>
    );

    const wrappedComponent = mountedComponent.find(TestComponent);

    const googleReCaptchaProps = (wrappedComponent.props() as IWithGoogleReCaptchaProps)
      .googleReCaptchaProps;

    expect(googleReCaptchaProps).toHaveProperty('executeRecaptcha');
  });
});
