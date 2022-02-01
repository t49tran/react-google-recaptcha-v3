import React from 'react';
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  createContext,
  ReactNode
} from 'react';
import {
  cleanGoogleRecaptcha,
  injectGoogleReCaptchaScript,
  logWarningMessage
} from './utils';

enum GoogleRecaptchaError {
  SCRIPT_NOT_AVAILABLE = 'Recaptcha script is not available'
}

interface IGoogleReCaptchaProviderProps {
  reCaptchaKey: string;
  language?: string;
  useRecaptchaNet?: boolean;
  useEnterprise?: boolean;
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
    id?: string;
    onLoadCallbackName?: string;
  };
  inlineBadgeId?: string | HTMLElement;
  parameters?: {
    sitekey?: string;
    badge?: string;
    theme?: string;
    size?: string;
    tabindex?: number;
    callback?: () => void;
    expiredCallback?: () => void;
    errorCallback?: () => void;
  };
  children: ReactNode;
}

export interface IGoogleReCaptchaConsumerProps {
  executeRecaptcha?: (action?: string) => Promise<string>;
}

const GoogleReCaptchaContext = createContext<IGoogleReCaptchaConsumerProps>({
  executeRecaptcha: () => {
    // This default context function is not supposed to be called
    throw Error(
      'GoogleReCaptcha Context has not yet been implemented, if you are using useGoogleReCaptcha hook, make sure the hook is called inside component wrapped by GoogleRecaptchaProvider'
    );
  }
});

const { Consumer: GoogleReCaptchaConsumer } = GoogleReCaptchaContext;

export function GoogleReCaptchaProvider({
  reCaptchaKey,
  useEnterprise = false,
  useRecaptchaNet = false,
  scriptProps,
  language,
  inlineBadgeId,
  parameters = {},
  children
}: IGoogleReCaptchaProviderProps) {
  const [greCaptchaInstance, setGreCaptchaInstance] = useState<null | {
    execute: Function;
  }>(null);
  const clientId = useRef<number | string>(reCaptchaKey);

  useEffect(() => {
    if (!reCaptchaKey) {
      logWarningMessage(
        '<GoogleReCaptchaProvider /> recaptcha key not provided'
      );

      return;
    }

    const scriptId = scriptProps?.id || 'google-recaptcha-v3';
    const onLoadCallbackName = scriptProps?.onLoadCallbackName || 'onRecaptchaLoadCallback';

    ((window as unknown) as {[key: string]: () => void})[onLoadCallbackName] = () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const grecaptcha = useEnterprise
        ? (window as any).grecaptcha.enterprise
        : (window as any).grecaptcha;

      const params = {
        badge: 'inline',
        size: 'invisible',
        sitekey: reCaptchaKey,
        ...(parameters || {})
      };
      clientId.current = grecaptcha.render(inlineBadgeId, params);
    };

    const onLoad = () => {
      if (!window || !(window as any).grecaptcha) {
        logWarningMessage(
          `<GoogleRecaptchaProvider /> ${GoogleRecaptchaError.SCRIPT_NOT_AVAILABLE}`
        );

        return;
      }

      const grecaptcha = useEnterprise
        ? (window as any).grecaptcha.enterprise
        : (window as any).grecaptcha;

      grecaptcha.ready(() => {
        setGreCaptchaInstance(grecaptcha);
      });
    };

    const onError = () => {
      logWarningMessage('Error loading google recaptcha script');
    };

    injectGoogleReCaptchaScript({
      render: inlineBadgeId ? 'explicit' : reCaptchaKey,
      onLoadCallbackName,
      useEnterprise,
      useRecaptchaNet,
      scriptProps,
      language,
      onLoad,
      onError
    });

    return () => {
      cleanGoogleRecaptcha(scriptId);
    };
  }, [useEnterprise, useRecaptchaNet, scriptProps, language, reCaptchaKey]);

  const executeRecaptcha = useCallback(
    async (action?: string) => {
      if (!greCaptchaInstance || !greCaptchaInstance.execute) {
        throw new Error(
          '<GoogleReCaptchaProvider /> Google Recaptcha has not been loaded'
        );
      }

      return await greCaptchaInstance.execute(clientId.current, { action });
    },
    [greCaptchaInstance, clientId]
  );

  const googleReCaptchaContextValue = useMemo(
    () => ({
      executeRecaptcha: greCaptchaInstance ? executeRecaptcha : undefined,
      inlineBadgeId,
    }),
    [executeRecaptcha, greCaptchaInstance, inlineBadgeId]
  );

  return (
    <GoogleReCaptchaContext.Provider value={googleReCaptchaContextValue}>
      {children}
    </GoogleReCaptchaContext.Provider>
  );
}

export { GoogleReCaptchaConsumer, GoogleReCaptchaContext };
