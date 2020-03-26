const { program } = require('commander');
const { pipeline } = require('stream');
const fs = require('fs');
const clc = require('cli-color')

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const data = [];

const transform = (chunk, shiftKey) => {

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


const writeStream = fs.createWriteStream('2.txt')

let result = '';
 
const readStream = fs.createReadStream(program.input, {highWaterMark: 1});
readStream.on('data', (chunk) => {
  const shiftKey = program.shift ? parseInt(program.shift) : 0
  const transfomedChunk = transform(chunk, shiftKey)
  data.push(transfomedChunk)
  result += transfomedChunk
  writeStream.write(transfomedChunk, () => {
    console.log('chunk')
  })
})
readStream.on('end', () => {
  console.log(clc.yellow(`result : ${result}`))
  console.log(data)
})

