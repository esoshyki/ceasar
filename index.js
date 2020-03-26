const { program } = require('commander');
const { pipeline } = require('stream');
const fs = require('fs');
const clc = require('cli-color')

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const data = [];

const transform = (chunk, shiftKey) => {

  console.log(chunk)
  const str = chunk.toString('utf8')

  const smallTransform = (char) => String.fromCharCode(((char.charCodeAt(0) + shiftKey - 97) % 26) + 97) 
  const bigTransform = (char) => String.fromCharCode(((char.charCodeAt(0) + shiftKey - 65) % 26) + 65)
  const isUpperCase = str => str === str.toUpperCase();
  const checkChunkIsLetter = (char) => alphabet.includes(char.toUpperCase())

  let result = '';

  for (let char of str) {
    console.log(char)
    console.log(isUpperCase(char))
    if (checkChunkIsLetter(char)) {
        result += isUpperCase(char) ? bigTransform(char) : smallTransform(char)
    }
  }
  return result
}

program
  .option('-s, --shift <value>', 'shifting')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-a, --action <action>', 'action')
  .parse(process.argv);

//  let result = '';



const input = program.input ? program.input : '';
const output = program.output ? program.output : 'output.txt';
const shiftKey = program.shiftKey ? parseInt(program.shift) : 0;

const writeStream = fs.createWriteStream(output);
const readStream = fs.createReadStream(input);


readStream.on('readable', () => {
  let chunk;

  while (null !== (chunk = readStream.read())) {
      console.log(chunk)
      data.push(chunk.toString('utf8'))
  }
})
readStream.on('end', () => {
  console.log(clc.yellow(`end of reading file`))
})

pipeline(
  readStream,
  // transform(),
  writeStream,
  (err) => {
    if (err) {
      console.log('Pipeline failed', err)
    } else {
      console.log('Pipeline succes')
    }
  }
)