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
  class WithGoogleReCaptchaComponent extends React.Component<
    OwnProps & Partial<IWithGoogleReCaptchaProps>
  > {
    static displayName: string;
    static wrappedComponent: React.ComponentType<
      OwnProps & Partial<IWithGoogleReCaptchaProps>
    >;

    render() {
      return (
        <GoogleReCaptchaConsumer>
          {googleReCaptchaValues => (
            <Component
              {...this.props}
              googleReCaptchaProps={googleReCaptchaValues}
            />
          )}
        </GoogleReCaptchaConsumer>
      );
    }
  }

  WithGoogleReCaptchaComponent.displayName = `withGoogleReCaptcha(${Component.displayName ||
    Component.name ||
    'Component'})`;

  WithGoogleReCaptchaComponent.wrappedComponent = Component;

  hoistNonReactStatics(WithGoogleReCaptchaComponent, Component);

  return WithGoogleReCaptchaComponent;
};
