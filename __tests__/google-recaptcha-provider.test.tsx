import * as React from 'react';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';
import { render, waitFor } from '@testing-library/react';

describe('<GoogleReCaptchaProvider />', () => {
  it('inject google recaptcha script to the document', () => {
    render(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useRecaptchaNet>
        <div />
      </GoogleReCaptchaProvider>
    );

    const scriptElm = document.querySelector('#google-recaptcha-v3');
    expect(scriptElm).not.toBeNull();
  });

  it('remove google recaptcha script from the document when being unmounted', async () => {
    const { unmount } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useRecaptchaNet>
        <div />
      </GoogleReCaptchaProvider>
    );

    const scriptElm = document.querySelector('#google-recaptcha-v3');
    expect(scriptElm).not.toBeNull();

    unmount();

    await waitFor(() => {
      const scriptElm = document.querySelector('#google-recaptcha-v3');
      expect(scriptElm).toBeNull();
    });
  });

  it('accept a useRecaptchaNet prop to load recaptcha from recaptcha.net', () => {
    render(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useRecaptchaNet>
        <div />
      </GoogleReCaptchaProvider>
    );

    const scriptElm = document.querySelector('#google-recaptcha-v3');

    expect(scriptElm!.getAttribute('src')).toEqual(
      'https://www.recaptcha.net/recaptcha/api.js?render=TESTKEY'
    );
  });

  it('puts a nonce to the script if provided', () => {
    render(
      <GoogleReCaptchaProvider
        reCaptchaKey="TESTKEY"
        scriptProps={{ nonce: 'NONCE' }}
      >
        <div />
      </GoogleReCaptchaProvider>
    );

    const scriptElm = document.getElementById('google-recaptcha-v3');

    expect(scriptElm!.getAttribute('nonce')).toEqual('NONCE');
  });

  it('puts a defer to the script if provided', () => {
    render(
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

    const scriptElm = document.getElementById('google-recaptcha-v3');

    expect(scriptElm!.getAttribute('defer')).toEqual('');
  });

  it('does not reload script if scriptProps object stays the same', async () => {
    const { rerender } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </GoogleReCaptchaProvider>
    );

    const scriptElm = document.querySelector('#google-recaptcha-v3');
    expect(scriptElm).not.toBeNull();

    rerender(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </GoogleReCaptchaProvider>
    );

    expect(scriptElm).toBe(document.querySelector('#google-recaptcha-v3'));
  });

  it('reloads script on scriptProps changes', async () => {
    const { rerender } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" scriptProps={{ async: false }}>
        <div />
      </GoogleReCaptchaProvider>
    );

    const scriptElm = document.querySelector('#google-recaptcha-v3');
    expect(scriptElm).not.toBeNull();

    rerender(
      <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" scriptProps={{ async: true }}>
        <div />
      </GoogleReCaptchaProvider>
    );

    expect(scriptElm).not.toBe(document.querySelector('#google-recaptcha-v3'));
  });

  describe('when using enterprise version', () => {
    it('accept an enterprise prop to load recaptcha from enterprise source', () => {
      render(
        <GoogleReCaptchaProvider reCaptchaKey="TESTKEY" useEnterprise>
          <div />
        </GoogleReCaptchaProvider>
      );

      const scriptElm = document.getElementById('google-recaptcha-v3');

      expect(scriptElm!.getAttribute('src')).toEqual(
        'https://www.google.com/recaptcha/enterprise.js?render=TESTKEY'
      );
    });

    it('should load recaptcha from recaptcha.net', () => {
      render(
        <GoogleReCaptchaProvider
          reCaptchaKey="TESTKEY"
          useEnterprise
          useRecaptchaNet
        >
          <div />
        </GoogleReCaptchaProvider>
      );

      const scriptElm = document.getElementById('google-recaptcha-v3');

      expect(scriptElm!.getAttribute('src')).toEqual(
        'https://www.recaptcha.net/recaptcha/enterprise.js?render=TESTKEY'
      );
    });
  });
});
