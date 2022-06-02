import React, { useEffect } from 'react';
import { useGoogleReCaptcha } from './use-google-recaptcha';
import { logWarningMessage } from './utils';

export interface IGoogleRecaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
  refreshReCaptcha?: any,
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
      // return value is not used, but here is used to avoid unused dependencies
      return refreshReCaptcha;
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

  const { inlineBadgeId } = googleRecaptchaContextValue;
  
  if (typeof inlineBadgeId === 'string') {
    return <div id={inlineBadgeId} />;  
  }

  return null;
}
