import { useEffect } from 'react';
import { useGoogleReCaptcha } from './use-google-recaptcha';
import { logWarningMessage } from './utils';

export interface IGoogleRecaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
}

export function GoogleReCaptcha({ action, onVerify }: IGoogleRecaptchaProps) {
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
  }, [action, onVerify, googleRecaptchaContextValue]);

  return null;
}
