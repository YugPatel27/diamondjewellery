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
          if (id.includes('node_modules')) {
            // PDF generation (large — keep isolated)
            if (id.includes('html2pdf') || id.includes('pdfkit') || id.includes('jspdf')) {
              return 'vendor-pdf';
            }
            // Animation library
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // React core
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('react/')) {
              return 'vendor-react';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Form handling
            if (id.includes('react-hook-form') || id.includes('sonner')) {
              return 'vendor-forms';
            }
            // Everything else (class utils, clsx, etc.)
            return 'vendor-misc';
          }
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
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