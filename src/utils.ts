interface InjectGoogleReCaptchaScriptParams {
  reCaptchaKey: string;
  useRecaptchaNet: boolean;
  useEnterprise: boolean;
  onLoad: () => void;
  language?: string;
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
    id?: string;
  };
}

export const isScriptInjected = (scriptId: string) =>
  !!document.querySelector(`#${scriptId}`);

const generateGoogleRecaptchaSrc = ({
  useRecaptchaNet,
  useEnterprise
}: {
  useRecaptchaNet: boolean;
  useEnterprise: boolean;
}) => {
  const hostName =
    useRecaptchaNet && !useEnterprise ? 'recaptcha.net' : 'google.com';
  const script = useEnterprise ? 'enterprise.js' : 'api.js';

  return `https://www.${hostName}/recaptcha/${script}`;
};

export const cleanGoogleRecaptcha = (scriptId: string) => {
  // remove badge
  const nodeBadge = document.querySelector('.grecaptcha-badge');
  if (nodeBadge && nodeBadge.parentNode) {
    document.body.removeChild(nodeBadge.parentNode);
  }

  // remove script
  const script = document.querySelector(`#${scriptId}`);
  if (script) {
    script.remove();
  }
};

export const injectGoogleReCaptchaScript = ({
  reCaptchaKey,
  language,
  onLoad,
  useRecaptchaNet,
  useEnterprise,
  scriptProps: {
    nonce = '',
    defer = false,
    async = false,
    id = '',
    appendTo = undefined
  } = {}
}: InjectGoogleReCaptchaScriptParams) => {
  const scriptId = id || 'google-recaptcha-v3';

  // Script has already been injected, just call onLoad and does othing else
  if (isScriptInjected(scriptId)) {
    onLoad();

    return;
  }

  /**
   * Generate the js script
   */
  const googleRecaptchaSrc = generateGoogleRecaptchaSrc({
    useEnterprise,
    useRecaptchaNet
  });
  const js = document.createElement('script');
  js.id = scriptId;
  js.src = `${googleRecaptchaSrc}?render=${reCaptchaKey}${
    language ? `&hl=${language}` : ''
  }`;

  if (!!nonce) {
    js.nonce = nonce;
  }

  js.defer = !!defer;
  js.async = !!async;
  js.onload = onLoad;

  /**
   * Append it to the body // head
   */
  const elementToInjectScript =
    appendTo === 'body'
      ? document.body
      : document.getElementsByTagName('head')[0];

  elementToInjectScript.appendChild(js);
};
