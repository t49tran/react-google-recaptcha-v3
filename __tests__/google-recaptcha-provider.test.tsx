import Enzyme from 'enzyme';
import * as React from 'react';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';

interface CaptchaMockI {
  ready: jest.Mock;
  execute: jest.Mock;
}

interface GrecaptchaMockI extends CaptchaMockI {
  enterprise: CaptchaMockI;
}

describe('<GoogleReCaptchaProvider />', () => {
  let grecaptchaMock: GrecaptchaMockI;

  beforeAll(() => {
    grecaptchaMock = {
      ready: jest.fn(),
      execute: jest.fn(),
      enterprise: { ready: jest.fn(), execute: jest.fn() }
    };
    (window as any).grecaptcha = grecaptchaMock;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

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
      <GoogleReCaptchaProvider
        reCaptchaKey="TESTKEY"
        scriptProps={{ nonce: 'NONCE' }}
      >
        <div />
      </GoogleReCaptchaProvider>
    );

    const googleRecaptchaScript = (mountedComponent.instance() as GoogleReCaptchaProvider).generateGoogleReCaptchaScript();
    expect(googleRecaptchaScript.getAttribute('nonce')).toEqual('NONCE');
  });

  it('puts a defer to the script if provided', () => {
    const mountedComponent = Enzyme.mount(
      <GoogleReCaptchaProvider
        reCaptchaKey="TESTKEY"
        scriptProps={{
          nonce: 'NONCE',
          defer: true
        }}
      >
        <div />
      </GoogleReCaptchaProvider>
    );

    const googleRecaptchaScript = (mountedComponent.instance() as GoogleReCaptchaProvider).generateGoogleReCaptchaScript();

    expect(googleRecaptchaScript.outerHTML).toEqual(
      `<script id="google-recaptcha-v3" src="https://www.google.com/recaptcha/api.js?render=TESTKEY" nonce="NONCE" defer=""></script>`
    );
  });

  it('execute recaptcha method correctly', async () => {
    const mountedComponent = Enzyme.mount(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY">
        <div />
      </GoogleReCaptchaProvider>
    );

    const googleReCaptchaProvider = mountedComponent.instance() as GoogleReCaptchaProvider;
    googleReCaptchaProvider.grecaptcha = Promise.resolve(grecaptchaMock);

    await (mountedComponent.instance() as GoogleReCaptchaProvider).executeRecaptcha(
      'test'
    );

    expect(grecaptchaMock.execute).toBeCalled();
  });

  it('handle load the default script', () => {
    Enzyme.mount(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY">
        <div />
      </GoogleReCaptchaProvider>
    );

    expect(grecaptchaMock.ready).toBeCalled();
  });

  describe('when using enterprise version', () => {
    it('accept an enterprise prop to load recaptcha from enterprise source', () => {
      const mountedComponent = Enzyme.mount(
        <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useEnterprise>
          <div />
        </GoogleReCaptchaProvider>
      );

      const googleRecaptchaSrc = (mountedComponent.instance() as GoogleReCaptchaProvider)
        .googleRecaptchaSrc;

      expect(googleRecaptchaSrc).toEqual(
        'https://www.google.com/recaptcha/enterprise.js'
      );
    });

    it('should not load recaptcha from recaptcha.net', () => {
      const mountedComponent = Enzyme.mount(
        <GoogleReCaptchaProvider
          reCaptchaKey="TESTKEY"
          useEnterprise
          useRecaptchaNet
        >
          <div />
        </GoogleReCaptchaProvider>
      );

      const googleRecaptchaSrc = (mountedComponent.instance() as GoogleReCaptchaProvider)
        .googleRecaptchaSrc;

      expect(googleRecaptchaSrc).toEqual(
        'https://www.google.com/recaptcha/enterprise.js'
      );
    });

    it('handle load the enterprise script', () => {
      Enzyme.mount(
        <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useEnterprise>
          <div />
        </GoogleReCaptchaProvider>
      );

      expect(grecaptchaMock.enterprise.ready).toBeCalled();
    });
  });
});
