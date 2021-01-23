import colors from 'vuetify/es5/util/colors'

export default {
  ssr: true, //Server Side Rendering
  ssrLog: true,
  dev: process.env.NODE_ENV !== 'production',
  telemetry: false, /* ignore the Nuxt.js starting question */
  // Global page headers (https://go.nuxtjs.dev/config-head)
    /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  head: {
    titleTemplate: '%s - ap-wsd-task',
    title: 'ap-wsd-task',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    [
      '@nuxtjs/component-cache',
      {
        max: 10000,
        maxAge: 1000 * 60 * 60
      }
    ]
  ],
  /*
  ** Server Middleware
  ** https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-servermiddleware/
  */
  serverMiddleware: {
    '/api': '~/api'
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},
  
  //issue: Nuxt is really slow: https://github.com/nuxt/nuxt.js/issues/6508
  vueMeta: {
    debounceWait: 250
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/sass/variables.scss'],
    theme: {
      dark: true,
      default: 'light',
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    parallel: true,
    cache: true,
    transpile: ['vue-intersect'],
    buildDir: '.nuxt',
    publicPath: '/assets/',
    //https://github.com/nuxt/nuxt.js/issues/3828#issuecomment-508428611
    filenames: {
      app: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js'
    },
    babel: {
      presets({ isServer }) {
        let targets = isServer ? { node: '10' } : { ie: '11' }
        return [
          [require.resolve('@nuxt/babel-preset-app'),
            {
              // targets
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      },
      'env': {
        'production': {
          'plugins': []
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Extend Webpack to load audio files
      config.module.rules.push({
        test: /\.(ogg|mp3|mp4|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '\[path\][name].[ext]'
        }
      })
      // Run ESLint on save
      if(ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
