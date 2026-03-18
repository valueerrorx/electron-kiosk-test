import { spawn } from 'child_process'
import { createServer, build } from 'vite'
import electron from 'electron'

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchMain(server) {
  let electronProcess = null
  const { NODE_OPTIONS, ...envBase } = process.env

  return build({
    configFile: 'packages/main/vite.config.ts',
    mode: 'development',
    plugins: [{
      name: 'electron-main-watcher',
      async writeBundle() {
        const addr = server.httpServer?.address?.()
        const host = !addr ? '127.0.0.1' : (addr.address === '::' || addr.address === '::1' || addr.address === '0.0.0.0') ? '127.0.0.1' : addr.address
        const port = addr?.port ?? server.config.server?.port ?? 3001
        const url = `http://${host}:${port}/`
        const env = Object.assign({}, envBase, {
          VITE_DEV_SERVER_HOST: host,
          VITE_DEV_SERVER_PORT: String(port),
          ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
        })
        electronProcess && electronProcess.kill()
        for (let i = 0; i < 30; i++) {
          try {
            const res = await fetch(url)
            if (res.ok) {
              await new Promise((r) => setTimeout(r, 800))
              break
            }
          } catch {}
          await new Promise((r) => setTimeout(r, 300))
        }
        console.log(`[electron] Loading ${url}`)
        electronProcess = spawn(electron, ['.'], { stdio: 'inherit', env })
      },
    }],
    build: {
      watch: true,
      target: 'esnext'
    },
  })
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchPreload(server) {
  return build({
    configFile: 'packages/preload/vite.config.ts',
    mode: 'development',
    plugins: [{
      name: 'electron-preload-watcher',
      writeBundle() {
        server.ws.send({ type: 'full-reload' })
      },
    }],
    build: {
      watch: true,
      target: 'esnext'
    },
  })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// bootstrap
const server = await createServer({ configFile: 'packages/renderer/vite.config.ts' })

await server.listen()
await watchPreload(server)
await watchMain(server)
