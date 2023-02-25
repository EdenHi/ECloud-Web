import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import styleImport, {AntdResolve} from 'vite-plugin-style-import'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        styleImport({
            resolves: [
                AntdResolve()
            ]
        })
    ],
    server: {
        host: "localhost",
        hmr: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: '@root-entry-name: default;',
            },
        },
    },
})
