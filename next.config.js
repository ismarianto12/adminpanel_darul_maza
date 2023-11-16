const path = require('path')
module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    APP_API: 'http://localhost/siakad_sdit/public/api/v1/',  //https://api.darulmaza.sch.id
    ASSETS_API: 'https://api.darulmaza.sch.id',
    DEV_USER_WEB: 'https://api.darulmaza.sch.id',
    // APP_API: 'http://localhost/siakad_sdit/public/api/v1/',  // 'https://api.darulmaza.sch.id/api/v1/',  //https://api.darulmaza.sch.id
    // ASSETS_API: 'http://localhost/siakad_sdit/public',
    // DEV_USER_WEB: 'https://api.darulmaza.sch.id',

    DEV_USER_PROD: '',
  },

  crossOrigin: 'anonymous',
  // basePath: '/admin',
  headers: () => {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: '*' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ];
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
