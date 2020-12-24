import * as React from 'react';
import * as ReactDom from 'react-dom';
import { GoogleReCaptchaProvider } from '../src/google-recaptcha-provider';
import { GoogleRecaptchaExample } from './google-recaptcha-example';

ReactDom.render(
  <GoogleReCaptchaProvider
    useRecaptchaNet
    reCaptchaKey={process.env.RECAPTCHA_KEY}
    scriptProps={{ async: true, defer: true, appendTo: 'body' }}
  >
    <h2>Google Recaptcha Example</h2>
    <GoogleRecaptchaExample />
  </GoogleReCaptchaProvider>,
  document.getElementById('app')
);
