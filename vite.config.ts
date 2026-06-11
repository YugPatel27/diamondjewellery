import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
  build: {
    target: 'es2018',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        format: 'es',
        dir: 'dist',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        // ── Manual chunks: split large vendor bundles ──────────────
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          // Derive top-level package name from node_modules path
          const parts = id.split('node_modules/')[1].split('/');
          const pkgName = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];

          // Map specific packages to named vendor chunks
          switch (pkgName) {
            case 'html2pdf.js':
            case 'jspdf':
            case 'pdfkit':
              return 'vendor-pdf';
            case 'framer-motion':
              return 'vendor-motion';
            case 'react':
            case 'react-dom':
            case 'react-router-dom':
              return 'vendor-react';
            case '@radix-ui/react-dialog':
            case '@radix-ui/react-dropdown-menu':
            case '@radix-ui/react-label':
            case '@radix-ui/react-separator':
            case '@radix-ui/react-slot':
            case '@radix-ui/react-toast':
            case '@radix-ui/react-tooltip':
              return 'vendor-radix';
            case 'react-hook-form':
            case 'sonner':
              return 'vendor-forms';
            case 'lucide-react':
            case 'clsx':
            case 'tailwind-merge':
              return 'vendor-ui';
            default:
              // Let Rollup handle other dependencies automatically to avoid circular chunks
              return undefined;
          }
        }
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})