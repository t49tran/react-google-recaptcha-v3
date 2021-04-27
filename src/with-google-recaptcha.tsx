import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ComponentType } from 'react';
import {
  GoogleReCaptchaConsumer,
  IGoogleReCaptchaConsumerProps
} from './google-recaptcha-provider';

export interface IWithGoogleReCaptchaProps {
  googleReCaptchaProps: IGoogleReCaptchaConsumerProps;
}

// tslint:disable-next-line:only-arrow-functions
export const withGoogleReCaptcha = function <OwnProps>(
  Component: ComponentType<OwnProps & Partial<IWithGoogleReCaptchaProps>>
): ComponentType<OwnProps & Partial<IWithGoogleReCaptchaProps>> {
  const WithGoogleReCaptchaComponent = (
    props: OwnProps & Partial<IWithGoogleReCaptchaProps>
  ) => (
    <GoogleReCaptchaConsumer>
      {googleReCaptchaValues => (
        <Component {...props} googleReCaptchaProps={googleReCaptchaValues} />
      )}
    </GoogleReCaptchaConsumer>
  );

  WithGoogleReCaptchaComponent.displayName = `withGoogleReCaptcha(${
    Component.displayName || Component.name || 'Component'
  })`;

  hoistNonReactStatics(WithGoogleReCaptchaComponent, Component);

  return WithGoogleReCaptchaComponent;
};
