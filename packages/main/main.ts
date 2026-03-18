/**
 * @license GPL LICENSE
 * Copyright (c) 2021 Thomas Michael Weissel
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>
 */


/**
 * This is the ELECTRON main file that actually opens the electron window
 */

import { app, BrowserWindow } from 'electron'

// Fix GPU process crash on Linux (Electron 41+, kernel 6.12+)
if (process.platform === 'linux') app.disableHardwareAcceleration()


if (!app.requestSingleInstanceLock()) {  // allow only one instance of the app per client
    app.quit()
    process.exit(0)
 }

import { release } from 'os'
import WindowHandler from './scripts/windowhandler.js'
import IpcHandler from './scripts/ipchandler.js'
import config from './config.js';
import log from 'electron-log/main';

WindowHandler.init(config)  // mainwindow, examwindow, blockwindow
IpcHandler.init(false, config, WindowHandler)  //controll all Inter Process Communication

log.initialize(); // initialize the logger for any renderer process
log.eventLogger.startLogging();
log.errorHandler.startCatching();
log.warn(`-------------------`)
log.warn(`main: starting Kiosk-Test-App "${config.version} ${config.info}"`)


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {  app.setAppUserModelId(app.getName())}
if (process.platform ==='darwin') {  app.dock.hide() }  // safer fullscreen


app.on('window-all-closed', () => {  // if window is closed
    WindowHandler.mainwindow = null
    app.quit()
})

app.on('second-instance', () => {
    if (WindowHandler.mainwindow) {
        if (WindowHandler.mainwindow.isMinimized()) WindowHandler.mainwindow.restore() // Focus on the main window if the user tried to open another
        WindowHandler.mainwindow.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) { allWindows[0].focus() } 
    else { WindowHandler.createMainWindow() }
})

app.whenReady()
.then(()=>{
    WindowHandler.createMainWindow()
})
