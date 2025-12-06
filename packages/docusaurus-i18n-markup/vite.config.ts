import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module'

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src/**/*'],
            outDir: 'build',
            rollupTypes: false,
        }),
    ],
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
            },
        },
        outDir: 'build',
        ssr: true,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react-markdown',
                /^@docusaurus\/.*/,
            ],
            output: [
                {
                    format: 'cjs',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    exports: 'named',
                    interop: 'auto',
                    entryFileNames: '[name].cjs',
                    chunkFileNames: '[name].cjs',
                },
                {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    exports: 'named',
                    entryFileNames: '[name].mjs',
                    chunkFileNames: '[name].mjs',
                },
            ],
        },
        sourcemap: true,
        minify: false,
    },
})
