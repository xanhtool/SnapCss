
step 0: rebuild node-sass:
```
git clone --recursive https://github.com/sass/node-sass.git
cd node-sass
npm install
```

step 1: add build configuration for electron
``` .json
 "build": {
    "buildDependenciesFromSource": "true",
    "npmRebuild": "false"
  },

```
step 2: then run `npm i electron-builder electron-rebuild electron@4.2.7 -D`

step 3: run `.\node_modules\.bin\electron-rebuild.cmd -f` or `.\node_modules\.bin\electron-rebuild.cmd -f -o node-sass`

step 4: Copy the generated binding.node file to the necessary directory (as @dvanoni and @hdytsgt  metion):
copy: `node-sass\bin\win32-x64-69\node-sass.node to {{target node-sass folder}}\node-sass\vendor\win32-x64-69\node-sass.node`
and copy: `node-sass\build\Release\binding.node to {{target node-sass folder}}\node-sass\vendor\win32-x64-69\`

that all thank all of you, have a nice day

