import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          card: "rgb(var(--surface-card) / <alpha-value>)",
          elevated: "rgb(var(--surface-elevated) / <alpha-value>)",
          hover: "rgb(var(--surface-hover) / <alpha-value>)",
          input: "rgb(var(--surface-input) / <alpha-value>)",
        },
        edge: {
          DEFAULT: "rgb(var(--edge) / <alpha-value>)",
          strong: "rgb(var(--edge-strong) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          light: "rgb(var(--primary-light) / <alpha-value>)",
          text: "rgb(var(--primary-text) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--danger) / <alpha-value>)",
          hover: "rgb(var(--danger-hover) / <alpha-value>)",
          light: "rgb(var(--danger-light) / <alpha-value>)",
          text: "rgb(var(--danger-text) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          border: "rgb(var(--accent-border) / <alpha-value>)",
          ring: "rgb(var(--accent-ring) / <alpha-value>)",
        },
        highlight: {
          DEFAULT: "rgb(var(--highlight) / <alpha-value>)",
          subtle: "rgb(var(--highlight-subtle) / <alpha-value>)",
          text: "rgb(var(--highlight-text) / <alpha-value>)",
          muted: "rgb(var(--highlight-muted) / <alpha-value>)",
        },
        indicator: "rgb(var(--indicator) / <alpha-value>)",
        "status-backlog": {
          DEFAULT: "rgb(var(--status-backlog) / <alpha-value>)",
          text: "rgb(var(--status-backlog-text) / <alpha-value>)",
          dot: "rgb(var(--status-backlog-dot) / <alpha-value>)",
        },
        "status-progress": {
          DEFAULT: "rgb(var(--status-progress) / <alpha-value>)",
          text: "rgb(var(--status-progress-text) / <alpha-value>)",
          dot: "rgb(var(--status-progress-dot) / <alpha-value>)",
        },
        "status-stuck": {
          DEFAULT: "rgb(var(--status-stuck) / <alpha-value>)",
          text: "rgb(var(--status-stuck-text) / <alpha-value>)",
          dot: "rgb(var(--status-stuck-dot) / <alpha-value>)",
        },
        "status-done": {
          DEFAULT: "rgb(var(--status-done) / <alpha-value>)",
          text: "rgb(var(--status-done-text) / <alpha-value>)",
          dot: "rgb(var(--status-done-dot) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
