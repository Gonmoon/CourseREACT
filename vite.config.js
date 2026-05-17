import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import "dotenv/config";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': `http://${process.env.HOST}:${process.env.PORT}`
        }
    },
    resolve: {
        alias: {
            '@shared': resolve(__dirname, 'src/shared'),
            '@pages': resolve(__dirname, 'src/pages'),
        },
    },
});
