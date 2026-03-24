// Tailwind configs
import tailwindcss from '@tailwindcss/vite';

// Laravel configs
import laravel from 'laravel-vite-plugin';

// Bundle analyzer
import { visualizer } from 'rollup-plugin-visualizer';

// Vite configs
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// Vite plugins
import checker from 'vite-plugin-checker';
import compression from 'vite-plugin-compression';

export default defineConfig(({ command, mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';
    const isDevelopment = mode === 'development';

    return {
        plugins: [
            // Laravel plugin
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.jsx',
                refresh: true,
                valetTls: env.VITE_VALET_TLS || false,
            }),

            // React plugin with optimized settings
            react({
                jsxRuntime: 'automatic',
                babel: {
                    plugins: isDevelopment
                        ? []
                        : [
                              ['transform-react-remove-prop-types', { removeImport: true }],
                              ['@babel/plugin-transform-react-constant-elements'],
                              ['@babel/plugin-transform-react-inline-elements'],
                          ],
                },
            }),

            // Tailwind CSS
            tailwindcss(),

            // TypeScript type checking (development only)
            !isProduction &&
                checker({
                    typescript: true,
                    eslint: {
                        lintCommand: 'eslint "./resources/js/**/*.{ts,tsx}"',
                    },
                    overlay: {
                        initialIsOpen: false,
                    },
                }),

            // Compression for production builds
            isProduction &&
                compression({
                    algorithm: 'gzip',
                    ext: '.gz',
                    threshold: 10240, // Only compress files larger than 10kb
                    deleteOriginalAssets: false,
                }),

            // Bundle analyzer (optional)
            env.VITE_ANALYZE === 'true' &&
                visualizer({
                    open: true,
                    filename: 'build/stats.html',
                    gzipSize: true,
                    brotliSize: true,
                }),
        ].filter(Boolean),

        // Build configuration
        build: {
            sourcemap: isDevelopment ? 'inline' : false,
            minify: isProduction ? 'esbuild' : false,
            target: 'es2020',
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'react-router-dom'],
                        ui: ['@headlessui/react', '@heroicons/react'],
                        utils: ['axios', 'lodash', 'date-fns'],
                    },
                    chunkFileNames: isProduction ? 'assets/[name]-[hash].js' : 'assets/[name].js',
                    assetFileNames: isProduction ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]',
                },
            },
            reportCompressedSize: true,
            cssCodeSplit: true,
            assetsInlineLimit: 4096, // Inline assets smaller than 4kb
        },

        // Server configuration
        server: {
            host: env.VITE_HOST || 'localhost',
            port: parseInt(env.VITE_PORT) || 5173,
            strictPort: false,
            open: env.VITE_OPEN_BROWSER === 'true',
            cors: true,
            hmr: {
                host: env.VITE_HMR_HOST || 'localhost',
                protocol: env.VITE_HMR_PROTOCOL || 'ws',
            },
        },

        // Preview configuration
        preview: {
            host: 'localhost',
            port: 4173,
            strictPort: true,
        },

        // Resolve configuration
        resolve: {
            alias: {
                '@': '/resources/js',
                '@components': '/resources/js/components',
                '@pages': '/resources/js/pages',
                '@hooks': '/resources/js/hooks',
                '@utils': '/resources/js/utils',
                '@types': '/resources/js/types',
                '@css': '/resources/css',
                '@public': '/public',
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },

        // CSS configuration
        css: {
            devSourcemap: isDevelopment,
            modules: {
                localsConvention: 'camelCase',
                generateScopedName: isProduction ? '[hash:base64:5]' : '[name]__[local]--[hash:base64:5]',
            },
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@css/variables.scss";`,
                },
            },
        },

        // ESBuild configuration
        esbuild: {
            jsx: 'automatic',
            jsxImportSource: 'react',
            target: 'es2020',
            logLevel: 'warning',
            // Remove console.log in production
            drop: isProduction ? ['console', 'debugger'] : [],
        },

        // Optimize dependencies
        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom', 'axios'],
            exclude: ['@tailwindcss/vite'],
            esbuildOptions: {
                target: 'es2020',
            },
        },

        // Environment variables
        define: {
            __APP_ENV__: JSON.stringify(mode),
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
            __DEV__: isDevelopment,
        },
    };
});
