const { program } = require('commander');
 
program
  .option('-s, --shift', 'shifting')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-a, --action <action>', 'action')
  .parse(process.argv);
 
if (program.shift) console.log(program.shift);
if (program.input) console.log(program.input);
if (program.output) console.log(program.output);
if (program['action']) console.log(program['action']);
