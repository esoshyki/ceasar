const { program } = require('commander');
const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs');
const clc = require('cli-color')
const readline = require('readline');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

program
  .option('-s, --shift <value>', 'shifting')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-a, --action <action>', 'action')
  .parse(process.argv);

const shiftKey = program.shiftKey ? parseInt(program.shiftKey) : 0
const input = program.input;
const output = program.output;

console.log(output)

const transform = () => {
  const transformFunc = (chunk, encoding, callback) => {
    const str = chunk.toString('utf8');
    const data = str.split('').reverse().join('')
    callback(null, data)
  }

  return new stream.Transform({
    transform: transformFunc
  })
}

let inputData = ''

const readStdinStream = process.stdin;
readStdinStream.setEncoding('utf8');
readStdinStream.on('data', () => {
  inputData += readStdinStream.read();
})

if (!output) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(clc.cyan('Output is missing, please, enter output'), (answer) => {
    output += answer
    rl.close();
  });
}


const readStream =  input ? fs.createReadStream(input) : readStdinStream;
const writeStream = fs.createWriteStream(output);

async function run() {
  await pipeline(
    readStream,
    transform(),
    writeStream,
    process.exit(0)
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);