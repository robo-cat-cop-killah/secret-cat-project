const {exec} = require('child_process');

console.log("Starting asmator web browser ... ");
exec(process.env.ASMA_CHROME_BIN + ' ' + process.env.ASMA_CHROME_ARGS);

