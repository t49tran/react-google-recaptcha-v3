import { useContext } from 'react';
import { GoogleReCaptchaContext } from './google-recaptcha-provider';

export const useGoogleReCaptcha = () => useContext(GoogleReCaptchaContext);
