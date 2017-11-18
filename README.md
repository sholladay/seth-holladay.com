# [seth-holladay.com](https://seth-holladay.com) [![Build status for seth-holladay.com](https://img.shields.io/circleci/project/sholladay/seth-holladay.com/master.svg "Build Status")](https://circleci.com/gh/sholladay/seth-holladay.com "Builds")

> Personal website of Seth Holladay

## Contents

 - [Why?](#why)
 - [Install](#install)
 - [Usage](#usage)
 - [API](#api)
 - [Testing](#testing)
 - [Continuous delivery](#continuous-delivery)
 - [Web services](#web-services)
 - [Contributing](#contributing)
 - [License](#license)

## Why?

 - Blogs are fun
 - Cutting edge deployment tech
 - Useful as boilerplate for servers

## Install

```sh
git clone git@github.com:sholladay/seth-holladay.com.git &&
cd seth-holladay.com &&
cp .env.example .env &&
npm link
```

To actually start the server and run the app, you will need credentials in order to connect to [web services](#web-services), such as Stripe. Once you have them, put them in `.env`.

**Note: Do not put any credentials in `.env.example`!** That file is committed to the repository and [putting secrets in there is unsafe](http://blog.arvidandersson.se/2013/06/10/credentials-in-git-repos). It is used to document and validate which credentials belong in `.env`. The latter is ignored and cannot be committed accidentally.

## Usage

```console
  Usage
    $ seth-holladay.com

  Option
    --port        Port number to listen on for HTTPS requests
    --open        Open the homepage in your browser
    --open=<url>  Open a specific page in your browser

  Example
    $ seth-holladay.com
    Seth ready at https://localhost/
    $ seth-holladay.com --port=7000
    Seth ready at https://localhost:7000/
```

## API

### new Server(option)

Returns a new [instance](#instance).

### option

#### port

Type: `number`

Port number to listen on for HTTP requests when the server is started.

#### stripePublicKey

Type: `string`

Public API key for [Stripe](https://stripe.com/).

#### stripeSecretKey

Type: `string`

Private API key for [Stripe](https://stripe.com/).

### Instance

#### .app

Type: `object`

App configuration, derived from the options passed to `new Server()`.

#### .start()

Returns a `Promise` for the server to be ready and listening for requests.

## Testing

You can run the automated tests with `npm test`.

## Continuous delivery

All commits, including pull requests, are tested by [Circle CI](https://circleci.com/about/).

For the `master` branch only, commits are also [deployed](https://github.com/sholladay/seth-holladay.com/blob/master/deploy.sh) to [dev.seth-holladay.com](https://dev.seth-holladay.com) within a few minutes of being pushed.

See the latest CI results at: https://circleci.com/gh/sholladay/seth-holladay.com

## Web services

We rely on these third-party services to provide functionality for the application and its infrastructure.

Provider | Description
---------|------------
[Stripe](https://stripe.com) | Payment transactions
[Zeit](https://zeit.co/now) | Server hosting and [DNS](https://en.wikipedia.org/wiki/Domain_Name_System)

## Contributing

See our [contributing guidelines](https://github.com/sholladay/seth-holladay.com/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/seth-holladay.com/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/seth-holladay.com/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/seth-holladay.com/blob/master/LICENSE "License for seth-holladay.com") © [Seth Holladay](https://seth-holladay.com "Author of seth-holladay.com")

Go make something, dang it.
