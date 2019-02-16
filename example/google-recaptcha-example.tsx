import * as React from "react";
import { useGoogleReCaptcha } from "../src/use-google-recaptcha";

export const GoogleRecaptchaExample: React.FunctionComponent = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [token, setToken] = React.useState("");

  const clickHandler = async () => {
    if (!executeRecaptcha) {
      return;
    }

    const result = await executeRecaptcha("homepage");

    setToken(result);
  };

  return (
    <div>
      <button onClick={clickHandler}>Test Recaptcha</button>
      {token && <p>Token: {token}</p>}
    </div>
  );
};
