const { spawn } = require('child_process');

const { exec } = require('child_process');


const subprocess = spawn("Xvfb", [':0','-shmem'], {
  detached: true,
  stdio: 'ignore'
});
subprocess.unref();

console.log("Starting asmator web browser ... ");
exec(process.env.ASMA_CHROME_BIN + ' ' + process.env.ASMA_CHROME_ARGS);

