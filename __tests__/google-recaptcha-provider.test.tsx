import Enzyme from 'enzyme';
import * as React from 'react';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';

describe('<GoogleReCaptchaProvider />', () => {
  it('accept a useRecaptchaNet prop to load recaptcha from recaptcha.net', () => {
    const mountedComponent = Enzyme.mount(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useRecaptchaNet>
        <div />
      </GoogleReCaptchaProvider>
    );

    const googleRecaptchaSrc = (mountedComponent.instance() as GoogleReCaptchaProvider)
      .googleRecaptchaSrc;

    expect(googleRecaptchaSrc).toEqual(
      'https://www.recaptcha.net/recaptcha/api.js'
    );
  });

  it('puts a nonce to the script if provided', () => {
    const mountedComponent = Enzyme.mount(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" nonce="NONCE">
        <div />
      </GoogleReCaptchaProvider>
    );

    const googleRecaptchaScript = (mountedComponent.instance() as GoogleReCaptchaProvider)
      .generateGoogleReCaptchaScript();

    expect(googleRecaptchaScript.outerHTML).toEqual(
      '<script id="google-recaptcha-v3" ' +
      'src="https://www.google.com/recaptcha/api.js?render=TESTKEY" nonce="NONCE"></script>'
    );
  });
});
