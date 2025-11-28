import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        paper: '#ffffff',
        mute: '#f5f5f5',
        line: '#eaeaea',
        accent: '#111111'
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: []
}
export default config
