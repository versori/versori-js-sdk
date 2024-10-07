# Versori JavaScript SDK

This repository contains packages to assist in the development against Versori APIs.

-   `@versori/sdk` - Contains a browser compatible SDK for Versori APIs
-   `@versori/sdk-react` - Contains React components for embedding Versori functionality in your application

These packages are designed to be used for integrations facilitated by [Versori Hubs][hubs], a no-code integration
platform for providing bespoke integrations to your customers.

> This project is currently a work in progress, with the following outstanding tasks:
>
> -   [ ] Add API endpoints for reading hub configuration, available integrations, and whether the current user is
>         connected to a given integration.
> -   [ ] Add React components to simplify the rendering of your Integration Hub.
> -   [ ] Add React components for collecting user credentials when connecting an integration by either API key or
>         OAuth 2.0.
> -   [ ] Simple `<script />` tag approach which allows attaching a custom "Connect" button to our SDK.
> -   [ ] Simple `<script />` tag approach which will render a full integration page with all integrations available to
>         connect to. This implementation will support theming to match the look and feel of your application.

## Getting Started

There are example project(s) in the `examples` directory that can be used to get started.

### Installation

```shell
npm install @versori/sdk @versori/sdk-react
```

Then use the components in your application:

```tsx
// TODO: show an example .tsx file importing and using both the API and React components
```

### Using the SDK

When using the Versori Hubs SDK with a script tag the SDK will be attached to the window at Window.Versori.

### Usage

##### Using onConnection as string

```
<script src="/versori-hubs-sdk" tpye="module" crossorigin></script>
<script>
     window.Versori.initHubs({
        userId: 'test',
        orgId: 'test orgId,
        originUrl: 'origin url'
        onConnection: 'client backend',
        onComplete: () => console.log('complete'),
        onError: (error: Error) => console.log(error.message, error.description)
    });
</script>
```

##### Using onConnection callback

```
<script src="/versori-hubs-sdk" tpye="module" crossorigin></script>
<script>
     window.Versori.initHubs({
        userId: 'test',
        orgId: 'test orgId,
        originUrl: 'origin url'
        onConnection: (connection) => console.log(connection),
        onError: (error) => console.log(error.message, error.description)
    });
</script>
```

## Script Options

| Option       | Type     | Params                       | Description                                                                                     |
| ------------ | -------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| userId       | string   |                              | The currently logged in user                                                                    |
| orgId        | string   |                              | The organisation Id used for the Versori Hubs SDK                                               |
| originUrl    | string   |                              | Url used to validate the origin of the window post message used for 0Auth matches the source    |
| onConnection | string   |                              | Url for SDK to POST direct to in order to sync connection info                                  |
| onConnection | function | connectionId, connectionInfo | Callback called after connection made. Useful when frontend wants to handle sync independently. |
| onComplete   | function |                              | Optional: Triggered after a successful POST request if a URL is provided in onConnection        |
| onError      | function | message, description         | Triggered at any point when an error would prevent the connection being made                    |

## Contributing

This repository is built as a monorepo from `src/`, and individual packages are published to NPM from `packages/` which
scope their functionality based on the `vite.config.ts` entrypoint.

To get started, clone the repository and install dependencies:

```shell
npm install
```

Then, build the packages:

```shell
npm run build:sdk
```

You can then run the example project(s), for example, using the React SPA example:

```shell
cd examples/react-spa
npm run dev
```

[hubs]: https://www.versori.com/integration-hub
