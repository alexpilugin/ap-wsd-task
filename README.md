# ap-wsd-task

Created by Alex Pilugin as a technical assignment for **[Wall Street Docs](https://www.wsd.tech)** in January 2021.
This Nuxt Universal (SSR) web app is bootstrapped with [npx create-nuxt-app](https://nuxtjs.org/docs/2.x/get-started/installation)      
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

## Screenshots

![screenshot ap-wsd-01.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-01.png "screenshot ap-wsd-01.png")    
![screenshot ap-wsd-02.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-02.png "screenshot ap-wsd-02.png")    
![screenshot ap-wsd-03.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-03.png "screenshot ap-wsd-04.png") 
![screenshot ap-wsd-04.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-04.png "screenshot ap-wsd-04.png") 
![screenshot ap-wsd-05.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-05.png "screenshot ap-wsd-05.png") 
![screenshot ap-wsd-06.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-06.png "screenshot ap-wsd-06.png") 
![screenshot ap-wsd-404.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-404.png "screenshot ap-wsd-404.png") 
![screenshot ap-wsd-routes.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-routes.png "screenshot ap-wsd-routes.png") 

# Update 03 Feb 2021

I had to create my own component to depict the audio waveform based on svg (scalable vector graphics) to support responsive design (window's resize event).
There is some delay with clicking "Play" button and the ***canplay** event (audio.oncanplay) since the audio component needs time to download a audio file.
This application doesn't use Vuex and SCSS (I can add it for money, not for free)

![screenshot ap-wsd-07.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-07.png "screenshot ap-wsd-07.png") 
![screenshot ap-wsd-08.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-08.png "screenshot ap-wsd-08.png") 
![screenshot ap-wsd-09.png](https://github.com/alexpilugin/ap-wsd-task/blob/main/static/screenshots/ap-wsd-09.png "screenshot ap-wsd-09.png") 