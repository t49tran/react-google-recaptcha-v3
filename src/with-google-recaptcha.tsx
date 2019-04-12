import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';
import {
  GoogleReCaptchaConsumer,
  IGoogleReCaptchaConsumerProps
} from './google-recaptcha-provider';

export interface IWithGoogleReCaptchaProps {
  googleReCaptchaProps: IGoogleReCaptchaConsumerProps;
}

// tslint:disable-next-line:only-arrow-functions
export const withGoogleReCaptcha = function<OwnProps>(
  Component: React.ComponentType<OwnProps & Partial<IWithGoogleReCaptchaProps>>
): React.ComponentType<OwnProps & Partial<IWithGoogleReCaptchaProps>> {
  const WithGoogleReCaptchaComponent: React.FunctionComponent<
    OwnProps & Partial<IWithGoogleReCaptchaProps>
  > = props => (
    <GoogleReCaptchaConsumer>
      {googleReCaptchaValues => (
        <Component {...props} googleReCaptchaProps={googleReCaptchaValues} />
      )}
    </GoogleReCaptchaConsumer>
  );

  WithGoogleReCaptchaComponent.displayName = `withGoogleReCaptcha(${Component.displayName ||
    Component.name ||
    'Component'})`;

  hoistNonReactStatics(WithGoogleReCaptchaComponent, Component);

  return WithGoogleReCaptchaComponent;
};
