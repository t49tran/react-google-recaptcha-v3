<h1 align="center">React Google Recaptcha V3</h1>
<div align="center">

[React](https://reactjs.org/) library for integrating Google ReCaptcha V3 to your App.

[![npm package](https://img.shields.io/npm/v/react-google-recaptcha-v3/latest.svg)](https://www.npmjs.com/package/react-google-recaptcha-v3)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![type definition](https://img.shields.io/npm/types/react-google-recaptcha-v3)

</div>

## Install

```bash
npm install react-google-recaptcha-v3
```

## Sponsors

<a href="https://wavedigital.com.au/" rel="noopener sponsored" target="_blank" style="margin-right: 16px;" title="Wave Digital">
<img width="75" src="https://dyp3dma8oum24.cloudfront.net/wp-content/themes/wavedigital/dist/assets/images/logo/wave-logo.png" alt="Wave Digital" loading="lazy" />
</a>

## Usage

#### Provide Recaptcha Key

To use `react-google-recaptcha-v3`, you need to create a recaptcha key for your domain, you can get one from [here](https://www.google.com/recaptcha/intro/v3.html).

#### Components

##### GoogleReCaptchaProvider

`react-google-recaptcha-v3` provides a `GoogleReCaptchaProvider` provider component that should be used to wrap around your components.

`GoogleReCaptchaProvider`'s responsibility is to load the necessary reCaptcha script and provide access to reCaptcha to the rest of your application.

You can customize the injected `script` tag with the `scriptProps` prop. This prop allows you to add `async`, `defer`, `nonce` attributes to the script tag. You can also control whether the injected script will be added to the document body or head with `appendTo` attribute. Example can be found belows. The `scriptProps` and its attributes are all optional.

It also provides an optional prop `language` to support different languages that is supported by Google Recaptcha.
https://developers.google.com/recaptcha/docs/language

The provider also provide the prop `useRecaptchaNet` to load script from `recaptcha.net`:
https://developers.google.com/recaptcha/docs/faq#can-i-use-recaptcha-globally

```javascript
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDom.render(
  <GoogleReCaptchaProvider
    reCaptchaKey="[Your recaptcha key]"
    language="[optional_language]"
    useRecaptchaNet="[optional_boolean_value]"
    scriptProps={{
      async: false, // optional, default to false,
      defer: false // optional, default to false
      appendTo: "head" // optional, default to "head", can be "head" or "body",
      nonce: undefined // optional, default undefined
    }}
  >
    <YourApp />
  </GoogleReCaptchaProvider>,
  document.getElementById('app')
);
```

There are three ways to trigger the recaptcha validation: using the `GoogleReCaptcha` component, wrapping your component with the HOC `withGoogleReCaptcha`, or using the custom hook `useGoogleReCaptcha`.

#### GoogleReCaptcha

`GoogleRecaptcha` is a react component that can be used in your app to trigger the validation. It provides a prop `onVerify`, which will be called once the verify is done successfully.

```javascript
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';

ReactDom.render(
  <GoogleReCaptchaProvider reCaptchaKey="[Your recaptcha key]">
    <GoogleReCaptcha onVerify={handleVerify} />
  </GoogleReCaptchaProvider>,
  document.getElementById('app')
);
```

```javascript
// IMPORTANT NOTES: The `GoogleReCaptcha` component is a wrapper around `useGoogleRecaptcha` hook and use `useEffect` to run the verification.
// It's important that you understand how React hooks work to use it properly.
// Avoid using inline function for the `onVerify` props as it can possibly cause the verify function to run continously.
// To avoid that problem, you can use a memoized function provided by `React.useCallback` or a class method
// The code below is an example that inline function can result in an infinite loop and the verify function runs continously:

const MyComponent: FC = () => {
  const [token, setToken] = useState();

  return (
    <div>
      <GoogleReCaptcha
        onVerify={token => {
          setToken(token);
        }}
      />
    </div>
  );
};
```

#### withGoogleReCaptcha

`GoogleRecaptcha` is a HOC (higher order component) that can be used to integrate reCaptcha validation with your component and trigger the validation programmatically. It inject the wrapped component with `googleReCaptchaProps` object.

The object contains the `executeRecaptcha` function that can be called to validate the user action.

```javascript
import {
  GoogleReCaptchaProvider,
  withGoogleReCaptcha
} from 'react-google-recaptcha-v3';

class ReCaptchaComponent extends React.Component {
  async componentDidMount() {
    const token = await this.props.googleReCaptchaProps.executeRecaptcha('homepage');
  }

  render() {
    ...
  }
}

const YourReCaptchaComponent = withGoogleReCaptcha(ReCaptchaComponent);

ReactDom.render(
  <GoogleReCaptchaProvider reCaptchaKey="[Your recaptcha key]">
    <YourReCaptchaComponent />
  </GoogleReCaptchaProvider>,
  document.getElementById('app')
);
```

#### React Hook: useGoogleReCaptcha

If you prefer a React Hook approach over the old good Higher Order Component, you can choose to use the custom hook `useGoogleReCaptcha` over the HOC `withGoogleReCaptcha`.

It's very simple to use the hook:

```javascript
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

const YourReCaptchaComponent  = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const token = executeRecaptcha("login_page");

  return (...)
}

ReactDom.render(
  <GoogleReCaptchaProvider reCaptchaKey="[Your recaptcha key]">
    <YourReCaptchaComponent />
  </GoogleReCaptchaProvider>,
  document.getElementById('app')
);
```

## Example

An example of how to use these two hooks can found inside the `example` folder. You will need to provide an .env file if you want to run it on your own machine.

```
RECAPTCHA_KEY=[YOUR_RECAPTCHA_KEY]
```
