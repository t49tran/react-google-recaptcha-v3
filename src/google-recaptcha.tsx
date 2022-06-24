import React, { useEffect } from 'react';
import { useGoogleReCaptcha } from './use-google-recaptcha';
import { logWarningMessage } from './utils';

export interface IGoogleRecaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
  refreshReCaptcha?: boolean | string | number | null;
}

export function GoogleReCaptcha({
  action,
  onVerify,
  refreshReCaptcha,
}: IGoogleRecaptchaProps) {
  const googleRecaptchaContextValue = useGoogleReCaptcha();

  useEffect(() => {
    const { executeRecaptcha } = googleRecaptchaContextValue;

    if (!executeRecaptcha) {
      return;
    }

    const handleExecuteRecaptcha = async () => {
      const token = await executeRecaptcha(action);

      if (!onVerify) {
        logWarningMessage('Please define an onVerify function');

        return;
      }

      onVerify(token);
    };

    handleExecuteRecaptcha();
  }, [action, onVerify, refreshReCaptcha, googleRecaptchaContextValue]);

  const { container } = googleRecaptchaContextValue;

  if (typeof container === 'string') {
    return <div id={container} />;
  }

  return null;
}
