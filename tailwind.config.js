// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "overlay-show": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "content-show": {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "overlay-show": "overlay-show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "content-show": "content-show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
}