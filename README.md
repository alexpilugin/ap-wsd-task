# ap-wsd-task

Created by Alex Pilugin as a technical assignment for **[Wall Street Docs](https://www.wsd.tech)** in January 2021.
This Nuxt Universal (SSR) web app is bootstrapped with [nuxt-express template](https://github.com/nuxt-community/express-template)     
This web application support SCSS preprocessor: [https://nuxtjs.org/faq/pre-processors/](https://nuxtjs.org/faq/pre-processors/)

Main feature of this application is Server Middleware:
```bash
# Server Middleware
  serverMiddleware: {
    '/api': '~/api'
  },
```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
