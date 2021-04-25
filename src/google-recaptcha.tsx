import { useEffect } from 'react';
import { useGoogleReCaptcha } from './use-google-recaptcha';

export interface IGoogleRecaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
}

export function GoogleReCaptcha({ action, onVerify }: IGoogleRecaptchaProps) {
  const googleRecaptchaContextValue = useGoogleReCaptcha();

  useEffect(() => {
    const { executeRecaptcha } = googleRecaptchaContextValue;
    const handleExecuteRecaptcha = async () => {
      if (!executeRecaptcha) {
        console.warn('Execute recaptcha function not defined');
        return;
      }

      const token = await executeRecaptcha(action);

      if (!onVerify) {
        console.warn('Please define an onVerify function');

        return;
      }

      onVerify(token);
    };

    handleExecuteRecaptcha();
  }, [action, onVerify, googleRecaptchaContextValue]);

  return null;
}
