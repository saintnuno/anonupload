const { app, BrowserWindow } = require('electron');
const config = require('./config.json');
const path = require("path");
const DataStore = require('./data/DataStore');

const data = new DataStore({ name: 'config' });

if (handleSquirrelEvent(app)) {

  return;
}

let win

function createWindow () {
    win = new BrowserWindow({ width: 800, height: 500, resizable: true, minHeight: 400, minWidth: 600, icon: path.join(__dirname, '/static/images/log2_zWV_icon.ico') })
    
    win.setMenu(null);
  win.loadFile('view/index.html')


  win.on('closed', () => {

    win = null
  })
}

let b;
if (data.getPrefs().prefs.launchOnStart === 'true') {
    b = true;
} else {
    b = false;
}

app.setLoginItemSettings({
    openAtLogin: b,
    path: app.getPath("exe")
});


app.on('ready', createWindow)


app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (win === null) {
    createWindow()
  }
})

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':

          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
    
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':

          application.quit();
          return true;
  }
};
