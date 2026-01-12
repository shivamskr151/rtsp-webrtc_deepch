import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/stream': {
                target: 'http://localhost:8083',
                changeOrigin: true
            },
            '/static': {
                target: 'http://localhost:8083',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild'
    }
})
