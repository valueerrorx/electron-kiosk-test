import{ipcMain} from 'electron'

class IpcHandler {
    constructor () {
        this.multicastClient = null
        this.config = null
        this.WindowHandler = null
    }
    init (mc, config, wh) {
        this.multicastClient = mc
        this.config = config
        this.WindowHandler = wh  


        /**
         * Switch to kiosk
         */ 
        ipcMain.handle('kioskmode', (event, state=true) => {   
            if (state) {
                this.WindowHandler.mainwindow.setAlwaysOnTop(true, "screen-saver", 1) 
                this.WindowHandler.mainwindow.setKiosk(true);
                this.WindowHandler.mainwindow.addListener('blur', () => this.WindowHandler.blurevent()) 
                this.WindowHandler.mainwindow.kiosk = true
            }
            else {
                this.WindowHandler.mainwindow.setKiosk(false);
                this.WindowHandler.mainwindow.removeAllListeners('blur')
                this.WindowHandler.mainwindow.kiosk = false
            }
        })


        /**
         * Returns the main config object
         */ 
        ipcMain.on('getconfig', (event) => {   event.returnValue = this.config   })

    }
}
 
export default new IpcHandler()
