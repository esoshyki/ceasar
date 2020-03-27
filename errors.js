const clc = require('cli-color')

const errors = {
  NO_ACTION : () => console.error(clc.red('Not implemented code action, please, use -a or --actioncod to fix it')),
  WRONG_ACTION: () => console.error(clc.red('Wrong actioncod parameter. "Decode" or "Encode" are availiable')),
  FILE_NOT_FOUNDED: () => console.error(clc.red('Input file was not founded')),
  INCORRECT_SHIFT_VALUE: () => console.error(clc.red('Incorrect shift value. Must be number'))
}

module.exports = errors