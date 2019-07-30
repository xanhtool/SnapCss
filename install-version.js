const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your version number you want to build? ', (version) => {
    console.log(`Thank you for selection: ${version}`);
    const { execSync } = require('child_process');
    let output = execSync(`code --install-extension snap-style-${version}.vsix`);
    // const { exec } = require("child_process")
    // exec(`code --install-extension snap-style-${version}.vsix`).unref()
    // var execSync = require('exec-sync');
    // var user = execSync('code --install-extension snap-style-${version}.vsix');
    console.log(output);
});