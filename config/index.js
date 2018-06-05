require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
let config = {
  development: {
    debug: true,
    lng: 'zh_CN',
    port: 3000,
    clientId: 'wybworker',
    mqtt: 'mqtt://root:123@api.h5.jamma.cn',
    gateway: 'http://api.h5.jamma.cn:81',
    modules: {
      '': {
        module: process.cwd() + '/lib'
      }
    }
  },
  production: {
    lng: 'zh_CN',
    port: 80,
    clientId: 'wybworker',
    gateway: 'http://gateway.app',
    modules: {
      '': {
        module: process.cwd() + '/lib'
      }
    }
  }
}

let env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

module.exports = config
