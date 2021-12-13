import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
    plugins: [reactRefresh()],
    resolve: {
        alias: {
            '@components': '/src/components',
            '@util': '/src/util',
            '@data': '/src/data',
        },
    },
    "build": {
        "outDir": './build'
    }
})
