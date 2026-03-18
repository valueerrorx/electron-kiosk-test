import pjson from "../../package.json"

const config = {
    development: false,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    showdevtools: true,
    version: pjson.version,
    info: ""
}
export default config
