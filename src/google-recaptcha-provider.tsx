import * as React from 'react';

enum GoogleRecaptchaError {
  SCRIPT_NOT_AVAILABLE = 'Google recaptcha is not available'
}

interface IGoogleReCaptchaProviderProps {
  reCaptchaKey?: string;
  useRecaptchaNet?: boolean;
  language?: string;
}

export interface IGoogleReCaptchaConsumerProps {
  executeRecaptcha?: (action?: string) => Promise<string>;
}

const GoogleReCaptchaContext = React.createContext<
  IGoogleReCaptchaConsumerProps
>({
  // dummy default context;
});

const { Consumer: GoogleReCaptchaConsumer } = GoogleReCaptchaContext;

export { GoogleReCaptchaConsumer, GoogleReCaptchaContext };

export class GoogleReCaptchaProvider extends React.Component<
  IGoogleReCaptchaProviderProps
> {
  scriptId = 'google-recaptcha-v3';
  hostname = this.props.useRecaptchaNet ? 'recaptcha.net' : 'google.com';
  googleRecaptchaSrc = `https://www.${hostname}/recaptcha/api.js`;
  resolver: any = undefined;
  rejecter: any = undefined;

  grecaptcha: Promise<any> = new Promise((resolve, reject) => {
    this.resolver = resolve;
    this.rejecter = reject;
  });

  componentDidMount() {
    if (!this.props.reCaptchaKey) {
      return;
    }

    this.injectGoogleReCaptchaScript();
  }

  componentDidUpdate(prevProps: IGoogleReCaptchaProviderProps) {
    if (prevProps.reCaptchaKey || !this.props.reCaptchaKey) {
      return;
    }

    this.injectGoogleReCaptchaScript();
  }

  componentWillUnmount(): void {
    // remove badge
      const nodeBadge = document.querySelector('.grecaptcha-badge');
      if (nodeBadge && nodeBadge.parentNode) {
        document.body.removeChild(nodeBadge.parentNode);
      }

    // remove script
      const script = document.querySelector(`#${this.scriptId}`);
      if (script) {
        script.remove();
      }
  }

  get googleReCaptchaContextValue() {
    return { executeRecaptcha: this.executeRecaptcha };
  }

  executeRecaptcha = async (action?: string) => {
    const { reCaptchaKey } = this.props;

    return this.grecaptcha.then(_grecaptcha =>
      _grecaptcha.execute(reCaptchaKey, { action })
    );
  };

  handleOnLoad = () => {
    if (!window || !(window as any).grecaptcha) {
      console.warn(GoogleRecaptchaError.SCRIPT_NOT_AVAILABLE);

      return;
    }

    (window as any).grecaptcha.ready(() => {
      this.resolver((window as any).grecaptcha);
    });
  };

  injectGoogleReCaptchaScript = () => {
    /**
     * Scripts has already been injected script,
     * return to avoid duplicated scripts
     */
    if (document.getElementById(this.scriptId)) {
      this.handleOnLoad();
      return;
    }

    const { reCaptchaKey, language } = this.props;
    const head = document.getElementsByTagName('head')[0];

    const js = document.createElement('script');
    js.id = this.scriptId;
    js.src = `${this.googleRecaptchaSrc}?render=${reCaptchaKey}${
      language ? `&hl=${language}` : ''
    }`;
    js.onload = this.handleOnLoad;

    head.appendChild(js);
  };

  render() {
    const { children } = this.props;

    return (
      <GoogleReCaptchaContext.Provider value={this.googleReCaptchaContextValue}>
        {children}
      </GoogleReCaptchaContext.Provider>
    );
  }
}
