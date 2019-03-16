const {
	app,
	BrowserWindow,
	Menu,
	shell,
	ipcMain,
	remote
} = require("electron");
const fs = require("fs");

const esettings = require("electron-settings");

let menu;
let template;
let mainWindow = null;
let settingsWindow = null;

// set defaults
if (!esettings.has("saves.default")) {
	console.log("set default save");
	esettings.set("saves.default", {
		gates: { and: [], wire: [], or: [], not: [], switch: [], led: [] },
		endNodes: [],
		startNodes: [],
		gridFactor: 20,
		snapFactor: 20
	});
}

console.log(esettings.getAll());

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
		alwaysOnTop: true
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
ipcMain.on("readFile", (e, path) => {
	
	try {
		let file = fs.readFileSync(path, 'utf8');
		let data = JSON.parse(file);
		e.sender.send("read", data);
	} catch (error) {
		e.sender.send("readError", `File Read Error: ${error}`);
	}
	
});
ipcMain.on("findFile", e => {
	const dialog = remote.dialog;
	dialog.showOpenDialog((filePaths) => {
		if (filePaths.length > 0) {
			e.sender.send("foundFile", filePaths[0]);
		}
		return;
	})
})

app.on("ready", () =>
	installExtensions()
	.then(() => {
		mainWindow = new BrowserWindow({
			show: false,
			width: 1024,
			height: 728,
			frame: false
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
