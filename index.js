var createUsergrid = require('save-usergrid')
  , predefinedProperties =
    [ 'uuid'
    , 'name'
    , 'type'
    , 'created'
    , 'modified'
    ]

module.exports = function (options) {
  return new BunyanUsergrid(options)
}

// TODO Implement a real writable stream
function BunyanUsergrid(options) {
  this.usergrid = createUsergrid(options.collection, options.auth)
  this.options = options

  // Usergrid has special properties
  // uuid, type, created, modified
  options.prefix = options.prefix || 'log_'
  options.logger = options.logger || console
}

BunyanUsergrid.prototype.write = function (entity) {
  var self = this

  // Handle UG special properties
  for (var i = 0; i < predefinedProperties.length; i++) {
    var prop = predefinedProperties[i]

    if (entity[prop]) {
      entity[self.options.prefix + prop] = entity[prop]

      delete entity[prop] // Possible deopt
    }
  }

  self.usergrid.create(entity, function (error) {
    if (error) self.options.logger.error(error)
  })
}
