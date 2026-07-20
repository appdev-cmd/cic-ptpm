/** @type {import('tailwindcss').Config} */
const p = (n) => `rgb(var(--primary-${n}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Màu chủ đạo (accent) - mặc định là Teal, hỗ trợ đổi runtime qua CSS variables
        primary: {
          50: p(50), 100: p(100), 200: p(200), 300: p(300), 400: p(400),
          500: p(500), 600: p(600), 700: p(700), 800: p(800), 900: p(900),
        },
        // Bề mặt & chữ theo theme tối/sáng của qa-qtdn (CSS variables trong index.css)
        app: 'var(--bg-app)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        subtle: 'var(--bg-subtle)',
        muted: 'var(--bg-muted)',
        bd: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        txt: {
          primary: 'var(--txt-primary)',
          secondary: 'var(--txt-secondary)',
          muted: 'var(--txt-muted)',
        },
        // Semantic màu cố định
        success: { 50: '#ecfdf5', 100: '#d1fae5', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        danger:  { 50: '#fef2f2', 100: '#fee2e2', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        info:    { 50: '#eff6ff', 100: '#dbeafe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
      },
      borderRadius: { xl: '16px', '2xl': '20px', '3xl': '24px' },
      opacity: { 12: '0.12' },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-pop)',
        pop: 'var(--shadow-pop)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: { 'fade-up': 'fade-up .25s ease-out' },
    },
  },
  plugins: [],
};
