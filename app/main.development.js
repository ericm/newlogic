const {
	app,
	BrowserWindow,
	dialog,
	Menu,
	shell,
	ipcMain,
	remote
} = require("electron");
const fs = require("fs");

const esettings = require("electron-settings");

const base64 = require("js-base64").Base64;

let icon = __dirname + '/img/icon.png';

if (process.platform == "win32") {
	icon = __dirname + '/img/icon.ico';
}

let menu;
let template;
let mainWindow = null;
let settingsWindow = null;

const settingsFile = app.getPath('userData') + "/Settings"

if (!fs.existsSync(settingsFile)) {
	fs.writeFileSync(settingsFile, "");
}

// set defaults
if (!esettings.has("settings")) {
	esettings.set("settings", {
		theme: 0,
		gridFactor: 20,
		snapGrid: true,
		snapFactor: 20,
		gridType: 0
	});
}

if (process.env.NODE_ENV === "production") {
	const sourceMapSupport = require("source-map-support"); // eslint-disable-line
	sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development") {
	require("electron-debug")(); // eslint-disable-line global-require
	const path = require("path"); // eslint-disable-line
	const p = path.join(__dirname, "..", "app", "node_modules"); // eslint-disable-line
	require("module").globalPaths.push(p); // eslint-disable-line
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});


const installExtensions = () => {
	if (process.env.NODE_ENV === "development") {
		const installer = require("electron-devtools-installer"); // eslint-disable-line global-require

		const extensions = [
			"REACT_DEVELOPER_TOOLS",
			"REDUX_DEVTOOLS"
		];
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)));
	}

	return Promise.resolve([]);
};

var settings = () => {
	settingsWindow = new BrowserWindow({
		show: false,
		width: 500,
		height: 500,
		alwaysOnTop: true,
		icon
	});

	settingsWindow.loadURL(`file://${__dirname}/settings.html`);

	settingsWindow.webContents.on("did-finish-load", () => {
		settingsWindow.show();
		settingsWindow.focus();
	});

	settingsWindow.on("closed", () => {
		settingsWindow = null;
	});
}

// File I/O
/// Open
const dialogProps = {filters:[
	{name: 'newlogic Save File (.nlsave)', extensions: ['nlsave']}
]}
ipcMain.on("readFile", (e, path) => {
	
	try {
		let file = fs.readFileSync(path, 'utf8');
		let data = JSON.parse(base64.decode(file));
		e.sender.send("read", data);
	} catch (error) {
		e.sender.send("readError", `File Read Error: ${error}`);
	}
	
});
ipcMain.on("findFile", e => dialog.showOpenDialog(mainWindow, dialogProps, filePaths => {
	if (!!filePaths && filePaths.length > 0) {
		e.sender.send("foundFile", filePaths[0]);
	}
}));

/// Save
ipcMain.on("savePath", e => dialog.showSaveDialog(mainWindow, dialogProps, fileName => {
	if (!!fileName) {
		e.sender.send("gotSave", fileName);
	}
}));
ipcMain.on("save", (e, data) => {
	try {
		let json = JSON.stringify(data["data"]);
		fs.writeFileSync(data["path"], base64.encode(json));
		e.sender.send("saved");
	} catch (error) {
		console.error(error);
	}
});

// Exit
ipcMain.on("exit", () => app.quit());

// Open
ipcMain.on("open", (_, data) => {
	require('electron').shell.openExternal(data);
})

app.on("ready", () =>
	installExtensions()
	.then(() => {
		mainWindow = new BrowserWindow({
			show: false,
			width: 1024,
			height: 728,
			minHeight: 700,
			minWidth: 1000,
			frame: false,
			icon
		});

		mainWindow.loadURL(`file://${__dirname}/app.html`);

		mainWindow.webContents.on("did-finish-load", () => {
			mainWindow.show();
			mainWindow.focus();
		});

		mainWindow.on("closed", () => {
			mainWindow = null;
		});

		if (process.env.NODE_ENV === "development") {
			mainWindow.openDevTools();
			mainWindow.webContents.on("context-menu", (e, props) => {
				const {
					x,
					y
				} = props;

				Menu.buildFromTemplate([{
					label: "Inspect element",
					click() {
						mainWindow.inspectElement(x, y);
					}
				}]).popup(mainWindow);
			});
		}

		mainWindow.setMenu(null);

		ipcMain.on("settings", () => {
			settings("");
		});
	}).catch((reason) => {
		console.log(reason);
	}));
