import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
  const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN

  return {
    // RẤT QUAN TRỌNG: trùng chính xác tên repo
    base: '/AI-For-Good/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(geminiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.GITHUB_TOKEN': JSON.stringify(githubToken),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }
})
