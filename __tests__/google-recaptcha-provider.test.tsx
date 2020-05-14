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
});
