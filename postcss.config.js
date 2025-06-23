// postcss.config.js
module.exports = {
  plugins: {
    // 1. Flatten nested rules (must come before Tailwind)
    "postcss-nesting": {},

    // 2. Tailwind
    tailwindcss: {},

    // 3. Autoprefixer
    autoprefixer: {},
  },
};
