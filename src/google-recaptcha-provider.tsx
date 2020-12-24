import * as React from 'react';

enum GoogleRecaptchaError {
  SCRIPT_NOT_AVAILABLE = 'Recaptcha script is not available'
}

interface IGoogleReCaptchaProviderProps {
  reCaptchaKey?: string;
  language?: string;
  useRecaptchaNet?: boolean;
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
  };
}

export interface IGoogleReCaptchaConsumerProps {
  executeRecaptcha: (action?: string) => Promise<string>;
}

const GoogleReCaptchaContext = React.createContext<IGoogleReCaptchaConsumerProps>(
  {
    executeRecaptcha: () => {
      // This default context function is not supposed to be called
      throw Error('GoogleReCaptcha Context has not yet been implemented');
    }
  }
);

const { Consumer: GoogleReCaptchaConsumer } = GoogleReCaptchaContext;

export { GoogleReCaptchaConsumer, GoogleReCaptchaContext };

export class GoogleReCaptchaProvider extends React.Component<IGoogleReCaptchaProviderProps> {
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
      console.warn('<GoogleReCaptchaProvider /> recaptcha key not provided');

      return;
    }

    this.injectGoogleReCaptchaScript();
  }

  componentDidUpdate(prevProps: IGoogleReCaptchaProviderProps) {
    if (!this.props.reCaptchaKey) {
      console.warn('<GoogleReCaptchaProvider /> recaptcha key not provided');
    }

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

    const js = this.generateGoogleReCaptchaScript();
    const { appendTo } = this.props.scriptProps || {};
    const elementToInjectScript =
      appendTo === 'body'
        ? document.body
        : document.getElementsByTagName('head')[0];

    elementToInjectScript.appendChild(js);
  };

  generateGoogleReCaptchaScript = () => {
    const {
      reCaptchaKey,
      language,
      scriptProps: { nonce, defer, async } = {}
    } = this.props;
    const js = document.createElement('script');
    js.id = this.scriptId;
    js.src = `${this.googleRecaptchaSrc}?render=${reCaptchaKey}${
      language ? `&hl=${language}` : ''
    }`;

    if (!!nonce) {
      js.nonce = nonce;
    }

    js.defer = !!defer;
    js.async = !!async;
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
