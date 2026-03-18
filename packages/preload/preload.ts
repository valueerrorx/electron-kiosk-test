/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2022 Thomas Michael Weissel
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
 * This is used to preload packages for the renderer process of electron (the frontend)
 */

import { contextBridge, ipcRenderer } from 'electron'

let config = ipcRenderer.sendSync('getconfig')  // we need to fetch the updated version of the systemconfig from express api (server.js)

/** document ready */
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

;(async () => {
  await domReady()
})()

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel: string, fn: (...args: unknown[]) => void) => ipcRenderer.on(channel, (_e, ...args) => fn(...args)),
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
})
contextBridge.exposeInMainWorld('config', config)

 

