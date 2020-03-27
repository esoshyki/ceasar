const clc = require('cli-color')

const errors = {
  NO_ACTION : () => console.error(clc.red('Not implemented code action, please, use -a or --actioncod to fix it')),
  WRONG_ACTION: () => console.error(clc.red('Wrong actioncod parameter. "Decode" or "Encode" are availiable'))
}

module.exports = errors