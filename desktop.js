import { app, BrowserWindow, Menu } from 'electron';
import { join, dirname, resolve } from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(join(__dirname, 'assets', 'icon-foreground.png'));


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'VOX',
    icon: join(__dirname, 'assets', 'icon-foreground.png'),
    webPreferences: {
      devTools: false,
    },
  });

  mainWindow.maximize();
  Menu.setApplicationMenu(null);
  mainWindow.setMenu(null);

  const cliPath = process.argv[2];
  const htmlPath = cliPath
    ? resolve(cliPath)
    : join(__dirname, 'www', 'index.html');

  if (fs.existsSync(htmlPath)) {
    mainWindow.loadFile(htmlPath);
  } else {
    mainWindow.loadURL(
      'data:text/html;charset=utf-8,' +
        encodeURIComponent(
          '<h1>Arquivo n\u00e3o encontrado</h1><p>' + htmlPath + '</p>',
        ),
    );
  }

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
    mainWindow.setTitle('VOX');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') app.quit();
});
