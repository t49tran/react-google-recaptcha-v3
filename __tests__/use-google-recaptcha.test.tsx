import * as React from 'react';
import { GoogleReCaptchaProvider } from 'src/google-recaptcha-provider';
import { useGoogleReCaptcha } from 'src/use-google-recaptcha';
import { renderHook } from '@testing-library/react-hooks';

const TestWrapper: React.FC = ({ children }) => (
  <GoogleReCaptchaProvider reCaptchaKey="TESTKEY">
    {children}
  </GoogleReCaptchaProvider>
);

describe('useGoogleReCaptcha hook', () => {
  it('return google recaptcha context value', () => {
    const { result } = renderHook(() => useGoogleReCaptcha(), {
      wrapper: TestWrapper
    });

    expect(result.current).toHaveProperty('executeRecaptcha');
  });
});
