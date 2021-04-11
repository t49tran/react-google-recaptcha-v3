import * as React from 'react';
import { FC, useMemo, useState, useEffect, useCallback } from 'react';
import { cleanGoogleRecaptcha, injectGoogleReCaptchaScript } from './utils';

enum GoogleRecaptchaError {
  SCRIPT_NOT_AVAILABLE = 'Recaptcha script is not available'
}

interface IGoogleReCaptchaProviderProps {
  reCaptchaKey?: string;
  language?: string;
  useRecaptchaNet?: boolean;
  useEnterprise?: boolean;
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
    id?: string;
  };
}

export interface IGoogleReCaptchaConsumerProps {
  executeRecaptcha?: (action?: string) => Promise<string>;
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

export const GoogleReCaptchaProvider: FC<IGoogleReCaptchaProviderProps> = ({
  reCaptchaKey,
  useEnterprise = false,
  useRecaptchaNet = false,
  scriptProps,
  language,
  children
}) => {
  const [greCaptchaInstance, setGreCaptchaInstance] = useState<null | {
    execute: Function;
  }>(null);

  useEffect(() => {
    if (!reCaptchaKey) {
      console.warn('<GoogleReCaptchaProvider /> recaptcha key not provided');

      return;
    }

    const scriptId = scriptProps?.id || 'google-recaptcha-v3';

    const onLoad = () => {
      if (!window || !(window as any).grecaptcha) {
        console.warn(
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

    injectGoogleReCaptchaScript({
      reCaptchaKey,
      useEnterprise,
      useRecaptchaNet,
      scriptProps,
      language,
      onLoad
    });

    return () => {
      cleanGoogleRecaptcha(scriptId);
    };
  }, [useEnterprise, useRecaptchaNet, scriptProps, language]);

  const executeRecaptcha = useCallback(
    async (action?: string) => {
      if (!greCaptchaInstance || !greCaptchaInstance.execute) {
        throw new Error(
          '<GoogleReCaptchaProvider /> Google Recaptcha has not been loaded'
        );
      }

      const result = await greCaptchaInstance.execute(reCaptchaKey, { action });

      return result;
    },
    [greCaptchaInstance]
  );

  const googleReCaptchaContextValue = useMemo(
    () => ({
      executeRecaptcha: greCaptchaInstance ? executeRecaptcha : undefined
    }),
    [executeRecaptcha, greCaptchaInstance]
  );

  return (
    <GoogleReCaptchaContext.Provider value={googleReCaptchaContextValue}>
      {children}
    </GoogleReCaptchaContext.Provider>
  );
};

export { GoogleReCaptchaConsumer, GoogleReCaptchaContext };
