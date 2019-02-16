import * as React from 'react';
import { GoogleReCaptchaContext } from './google-recaptcha-provider';

export const useGoogleReCaptcha = () =>
  React.useContext(GoogleReCaptchaContext);
