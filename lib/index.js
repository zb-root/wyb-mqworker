const mqtt = require('mqtt')
const log = require('jm-log4js')
const event = require('jm-event')
const MS = require('jm-ms')
const Promise = require('bluebird')
let ms = MS()

module.exports = function (opts) {
  ['gateway', 'mqtt', 'clientId']
    .forEach(function (key) {
      process.env[key] && (opts[key] = process.env[key])
    })

  let o = {
    config: opts
  }
  event.enableEvent(o)

  let bind = function (name, uri) {
    uri === undefined && (uri = opts.gateway + '/' + name)
    ms.client({
      uri: uri
    }, function (err, doc) {
      !err && doc && (o[name] = doc)
    })
  }
  bind('user')
  bind('insider')

  let logger = log.getLogger('mqworker')
  let mq = mqtt.connect(opts.mqtt, {clientId: opts.clientId || 'mqworker', clean: false})
  mq.on('connect', function (connack) {
    logger.info('connected')
    mq.subscribe([
      'user/signup'
    ], {qos: 1})
  })
  mq.on('reconnect', function () {
    logger.info('reconnect')
  })
  mq.on('close', function () {
    logger.info('close')
  })
  mq.on('offline', function () {
    logger.info('offline')
  })
  mq.on('error', function (err) {
    logger.info(err.stack)
  })

  let _onmessage = function (topic, message) {
    logger.info('topic: %j message: %j', topic.toString(), message.toString())
    let opts = null
    try {
      opts = JSON.parse(message)
      opts = opts || {}
      o.emit(topic, opts)
    } catch (e) {
      logger.error(e)
    }
  }

  mq.on('message', _onmessage)

  o.on('user/signup', function (opts) {

  })

  return o
}
