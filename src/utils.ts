interface IInjectGoogleReCaptchaScriptParams {
  render: string;
  onLoadCallbackName: string;
  useRecaptchaNet: boolean;
  useEnterprise: boolean;
  onLoad: () => void;
  onError: () => void;
  language?: string;
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
    id?: string;
  };
}

/**
 * Function to generate the src for the script tag
 *
 * @param param0
 * @returns
 */
const generateGoogleRecaptchaSrc = ({
  useRecaptchaNet,
  useEnterprise
}: {
  useRecaptchaNet: boolean;
  useEnterprise: boolean;
}) => {
  const hostName = useRecaptchaNet ? 'recaptcha.net' : 'google.com';
  const script = useEnterprise ? 'enterprise.js' : 'api.js';

  return `https://www.${hostName}/recaptcha/${script}`;
};

/**
 * Function to clean the recaptcha_[language] script injected by the recaptcha.js
 */
const cleanGstaticRecaptchaScript = () => {
  const script = document.querySelector(
    'script[src^="https://www.gstatic.com/recaptcha/releases"]'
  );

  if (script) {
    script.remove();
  }
};

/**
 * Function to check if script has already been injected
 *
 * @param scriptId
 * @returns
 */
export const isScriptInjected = (scriptId: string) =>
  !!document.querySelector(`#${scriptId}`);

/**
 * Function to remove default badge
 *
 * @returns
 */
const removeDefaultBadge = () => {
  const nodeBadge = document.querySelector('.grecaptcha-badge');
  if (nodeBadge && nodeBadge.parentNode) {
    document.body.removeChild(nodeBadge.parentNode);
  }
};

/**
 * Function to clear custom badge
 *
 * @returns
 */
const cleanCustomBadge = (customBadge: HTMLElement | null) => {
  if (!customBadge) {
    return;
  }

  while (customBadge.lastChild) {
    customBadge.lastChild.remove();
  }
};

/**
 * Function to clean node of badge element
 *
 * @param container
 * @returns
 */
export const cleanBadge = (container?: HTMLElement | string) => {
  if (!container) {
    removeDefaultBadge();

    return;
  }

  const customBadge = typeof container === 'string' ? document.getElementById(container) : container;

  cleanCustomBadge(customBadge);
};

/**
 * Function to clean google recaptcha script
 *
 * @param scriptId
 * @param container
 */
export const cleanGoogleRecaptcha = (scriptId: string, container?: HTMLElement | string) => {
  // remove badge
  cleanBadge(container);

  // remove old config from window
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (window as any).___grecaptcha_cfg = undefined;

  // remove script
  const script = document.querySelector(`#${scriptId}`);
  if (script) {
    script.remove();
  }

  cleanGstaticRecaptchaScript();
};

/**
 * Function to inject the google recaptcha script
 *
 * @param param0
 * @returns
 */
export const injectGoogleReCaptchaScript = ({
  render,
  onLoadCallbackName,
  language,
  onLoad,
  useRecaptchaNet,
  useEnterprise,
  scriptProps: {
    nonce = '',
    defer = false,
    async = false,
    id = '',
    appendTo
  } = {}
}: IInjectGoogleReCaptchaScriptParams) => {
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
  js.src = `${googleRecaptchaSrc}?render=${render}${
    render === 'explicit' ? `&onload=${onLoadCallbackName}` : ''
  }${
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

/**
 * Function to log warning message if it's not in production mode
 *
 * @param message String
 * @returns
 */
export const logWarningMessage = (message: string) => {
  const isDevelopmentMode =
    typeof process !== 'undefined' && !!process.env && process.env.NODE_ENV !== 'production';

  if (isDevelopmentMode) {
    return;
  }

  console.warn(message);
};
