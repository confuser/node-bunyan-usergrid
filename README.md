# bunyan-usergrid

[![Build Status](https://travis-ci.org/confuser/node-bunyan-usergrid.png?branch=master)](https://travis-ci.org/confuser/node-bunyan-usergrid)

Send bunyan logs into[Usergrid](https://usergrid.apache.org)

## Installation
```
npm install bunyan-usergrid
```

## Usage

Ensure stream `type` is set to `raw`

```js
var bunyan = require('bunyan')
  , bunyanUsergrid = require('bunyan-usergrid')
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

var logger = bunyan.createLogger(
  { name: 'test'
  , streams: [ { type: 'raw', stream: bunyanUsergrid(opts) } ]
  })
```
