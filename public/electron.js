const electron = require("electron");
const ipc = electron.ipcMain;
const { app, session } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const join = path.join;
const isDev = require("electron-is-dev");
const { lstatSync, readdirSync } = require("fs");
const { autoUpdater } = require("electron-updater");
const {
  SeleniumAutomation,
} = require("./electron_related/automate_actions.js");
const {
  runMyPony,
  runMiPony,
} = require("./electron_related/run_external_program.js");

let mainWindow;
let loadingScreen;

let socket;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Ventana principal
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    icon: "",
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/electron_related/preload.js`,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
    resizable: false,
    // show: false,
  });

  mainWindow.setMenuBarVisibility(false);

  // Inicio react
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Abro herramientas de desarrollo
  console.log(isDev);
  if (isDev) {
    mainWindow.webContents.openDevTools();
    // Agrego extensiones
    addExtensions();
  }

  mainWindow.on("ready-to-show", () => {
    // if (loadingScreen) {
    //   loadingScreen.close();
    // }
    mainWindow.show();
    // mainWindow.focus();
  });

  // Cierro programa al cerrar ventana
  mainWindow.on("closed", () => (mainWindow = null));
};

// Se ejecuta cuando inicia la app
app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdates();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 1000 * 60 * 15);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Auto update
// when the update is ready, notify the BrowserWindow
autoUpdater.on("update-downloaded", (info) => {
  console.log("downloaded", info);
  mainWindow.webContents.send("UPDATE_READY", info);
});

ipc.on("QUIT_AND_INSTALL", (event, arg) => {
  console.log("install");
  autoUpdater.quitAndInstall();
});

// =================================
//   Manejo de eventos asincronos
// =================================
const sendLinkListGeneratorMessage = (type, payload) => {
  mainWindow.webContents.send(
    "LINK_LIST_GENERATOR_MESSAGE",
    JSON.stringify({
      type,
      payload,
    })
  );
};

ipc.on("GET_DOWNLOAD_LINKS", (event, data) => {
  sendLinkListGeneratorMessage("GENERATION_START", data);
  let automation = new SeleniumAutomation();

  automation
    .get_download_links(
      data,
      (completedLink) => {
        sendLinkListGeneratorMessage("GENERATION_LINK_FINISH", completedLink);
      },
      (failedLink) => {
        sendLinkListGeneratorMessage("GENERATION_LINK_FAILED", failedLink);
      },
      (linkStarted) => {
        sendLinkListGeneratorMessage("GENERATION_LINK_START", linkStarted);
      }
    )
    .then((links) => {
      sendLinkListGeneratorMessage("GENERATION_FINISH", links);
    })
    .catch((e) => console.log(e));
});

// =================================
// Manejo de eventos sincronos
// =================================
ipc.on("MINIMIZE_WINDOW", (event, arg) => {
  mainWindow.minimize();
});
ipc.on("CLOSE_WINDOW", (event, arg) => {
  mainWindow.close();
});
ipc.on("EXECUTE_MIPONY", (event, arg) => {
  runMiPony();
});

// =================================
// Extensiones para desarrollo
// =================================
const addExtensions = () => {
  var extension_path = join(
    process.env.APPDATA.replace(process.env.APPDATA.split(path.sep).pop(), ""),
    "Local",
    "Google",
    "Chrome",
    "User Data",
    "Default",
    "Extensions"
  );
  var react_dev_tools = "fmkadmapgofadopljbjfkapdkoienihi";
  var redux_dev_tools = "lmhkpmbekcpmknklioeibfkpmmfibljd";

  const isDirectory = (source) => lstatSync(source).isDirectory();
  const getDirectories = (source) =>
    readdirSync(source)
      .map((name) => join(source, name))
      .filter(isDirectory);

  try {
    app.whenReady().then(async () => {
      await session.defaultSession.loadExtension(
        getDirectories(`${path.join(extension_path, react_dev_tools)}`)[0]
      );
    });

    app.whenReady().then(async () => {
      await session.defaultSession.loadExtension(
        getDirectories(`${path.join(extension_path, redux_dev_tools)}`)[0]
      );
    });
  } catch {
    console.log("No extensions");
  }
};
