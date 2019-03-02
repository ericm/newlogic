const {
	app,
	BrowserWindow,
	Menu,
	shell,
	ipcMain
} = require("electron");

const esettings = require("electron-settings");

let menu;
let template;
let mainWindow = null;
let settingsWindow = null;

// set defaults
if (!esettings.has("default")) {
	console.log("set default save");
	esettings.set("default", {
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
