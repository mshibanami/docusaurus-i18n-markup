import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module'

export default defineConfig({
    resolve: {
        // Exclude 'browser' field to prevent @babel/core from using browser stubs
        mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    },
    ssr: {
        noExternal: true,
    },
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
            formats: ['cjs'],
            fileName: (format, entryName) => `${entryName}.js`,
        },
        outDir: 'build',
        rollupOptions: {
            external: (id) => {
                if (['@docusaurus/logger'].includes(id)) {
                    return false
                }
                if (id.startsWith('@docusaurus/')
                    || id.startsWith('@babel/')
                    || builtinModules.includes(id)
                    || builtinModules.some((m) => id === `node:${m}`)) {
                    return true
                }
                return false
            },
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                exports: 'named',
                interop: 'auto',
            },
        },
        sourcemap: true,
        minify: false,
    },
})
