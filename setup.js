const {exec} = require('child_process');
exec("Xvfb :0");
console.log("Starting asmator web browser ... ");
exec(process.env.ASMA_CHROME_BIN + ' ' + process.env.ASMA_CHROME_ARGS);

