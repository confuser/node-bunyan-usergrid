var assert = require('assert')
  , bunyan = require('bunyan')
  , extend = require('lodash.assign')
  , nock = require('nock')
  , bunyanUsergrid = require('..')
  , opts =
    { collection: 'test'
    , auth:
      { host: 'https://localhost'
      , org: 'org'
      , app: 'app'
      , grantType: 'client_credentials'
      , clientId: 'client'
      , clientSecret: 'such secret, much wow'
      }
    }

describe('Bunyan Usergrid', function () {

  beforeEach(function () {
    nock('https://localhost')
      .post('/org/app/token')
      .reply(200, { 'access_token': 12345678 })
  })

  it('should send data to Usergrid', function (done) {
    var logger = bunyan.createLogger(
      { name: 'test'
      , streams: [ { type: 'raw', stream: bunyanUsergrid(opts) } ]
      })

    nock('https://localhost')
      .post('/org/app/test', function (body) {
        assert.equal(body.msg, 'hello world')

        done()

        return body
      })
      .reply(200, { entities: [ { } ] })

    logger.info('hello world')
  })

  it('should prefix predefined properties', function (done) {
    var logger = bunyan.createLogger(
      { name: 'test'
      , streams: [ { type: 'raw', stream: bunyanUsergrid(opts) } ]
      })
      , user = { type: 'test' }

    nock('https://localhost')
      .post('/org/app/test', function (body) {
        assert.equal(body.log_type, 'test')
        assert.equal(body.type, undefined)
        assert.equal(user.type, 'test')

        done()

        return body
      })
      .reply(200, { entities: [ { } ] })

    logger.info(user)
  })

  it('should allow a custom prefix', function (done) {
    var logger = bunyan.createLogger(
      { name: 'test'
      , streams: [ { type: 'raw', stream: bunyanUsergrid(extend({}, opts, { prefix: 'asd_' })) } ]
      })
      , user = { type: 'test' }

    nock('https://localhost')
      .post('/org/app/test', function (body) {
        assert.equal(body.asd_type, 'test')
        assert.equal(body.type, undefined)
        assert.equal(user.type, 'test')

        done()

        return body
      })
      .reply(200, { entities: [ { } ] })

    logger.info(user)
  })

  it('should allow a custom logger', function (done) {
    var errorLogger =
      { error: function (error) {
        assert.equal(error.message, 'test')

        done()
      }}
      , logger = bunyan.createLogger(
      { name: 'test'
      , streams: [ { type: 'raw', stream: bunyanUsergrid(extend({}, opts, { logger: errorLogger })) } ]
      })
      , user = { type: 'test' }

    nock('https://localhost')
      .post('/org/app/test')
      .replyWithError('test')

    logger.info(user)
  })

})
