const { program } = require('commander');
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');
const clc = require('cli-color')

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const checkChunkIsLetter = (char) => alphabet.includes(char.toUpperCase())

const transform = (char, shiftKey) => {

  const isUpperCase = str => str === str.toUpperCase();
  return isUpperCase(char) ? 
  String.fromCharCode(((char.charCodeAt(0) + shiftKey - 65) % 26) + 65) :
  String.fromCharCode(((char.charCodeAt(0) + shiftKey - 97) % 26) + 97);
}

program
  .option('-s, --shift <value>', 'shifting')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-a, --action <action>', 'action')
  .parse(process.argv);

 let result = '';
 
const readStream = fs.createReadStream(program.input);
readStream.on('readable', () => {
  let chunk;
  const shiftKey = program.shift ? parseInt(program.shift) : 0

  while (null !== (chunk = readStream.read(1))) {
    const char = chunk.toString('utf8');
    if (checkChunkIsLetter(char)) {
      const letter = transform(char, shiftKey)
      result += letter
    }
  }
})
readStream.on('end', () => {
  console.log(clc.yellow(`result : ${result}`))
})

