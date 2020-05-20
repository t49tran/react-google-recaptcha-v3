import * as React from 'react';

enum GoogleRecaptchaError {
  SCRIPT_NOT_AVAILABLE = 'Recaptcha script is not available'
}

interface IGoogleReCaptchaProviderProps {
  reCaptchaKey?: string;
  language?: string;
  useRecaptchaNet?: boolean;
  nonce?: string;
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
  resolver: any = undefined;
  rejecter: any = undefined;

  grecaptcha: Promise<any> = new Promise((resolve, reject) => {
    this.resolver = resolve;
    this.rejecter = reject;
  });

  get googleRecaptchaSrc() {
    const { useRecaptchaNet } = this.props;
    const hostName = useRecaptchaNet ? 'recaptcha.net' : 'google.com';

    return `https://www.${hostName}/recaptcha/api.js`;
  }

  get googleReCaptchaContextValue() {
    return { executeRecaptcha: this.executeRecaptcha };
  }

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

  componentWillUnmount() {
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

    const head = document.getElementsByTagName('head')[0];

    const js = this.generateGoogleReCaptchaScript();

    head.appendChild(js);
  };

  generateGoogleReCaptchaScript = () => {
    const { reCaptchaKey, language, nonce } = this.props;
    const js = document.createElement('script');
    js.id = this.scriptId;
    js.src = `${this.googleRecaptchaSrc}?render=${reCaptchaKey}${
      language ? `&hl=${language}` : ''
    }`;
    if (!!nonce) {
      js.nonce = nonce;
    }
    js.onload = this.handleOnLoad;

    return js;
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
