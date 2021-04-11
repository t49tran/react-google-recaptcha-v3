import { render } from '@testing-library/react';
import * as React from 'react';
import {
  GoogleReCaptchaProvider,
  IGoogleReCaptchaConsumerProps
} from 'src/google-recaptcha-provider';
import {
  IWithGoogleReCaptchaProps,
  withGoogleReCaptcha
} from 'src/with-google-recaptcha';

const TestComponent = ({
  googleReCaptchaProps,
  onLoad
}: Partial<IWithGoogleReCaptchaProps> & {
  onLoad: (props: IGoogleReCaptchaConsumerProps) => void;
}) => {
  React.useEffect(() => {
    if (!googleReCaptchaProps) {
      return;
    }

    console.log(googleReCaptchaProps);

    onLoad(googleReCaptchaProps);
  }, [googleReCaptchaProps]);

  return <div />;
};

const WrappedTestComponent = withGoogleReCaptcha(TestComponent);

const TestProvider = ({
  onLoad
}: {
  onLoad: (props: IGoogleReCaptchaConsumerProps) => void;
}) => (
  <GoogleReCaptchaProvider reCaptchaKey="TESTKEY">
    <WrappedTestComponent onLoad={onLoad} />
  </GoogleReCaptchaProvider>
);

describe('withGoogleRecaptcha HOC', () => {
  it('inject the wrapped component with googleReCaptcha prop', () => {
    const testFn = jest.fn();

    render(<TestProvider onLoad={testFn} />);

    expect(testFn).toBeCalledWith(
      expect.objectContaining({ executeRecaptcha: undefined })
    );
  });
});
