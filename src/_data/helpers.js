// src/_data/helpers.js (ESM)
export default {
  currentYear() {
    const today = new Date();
    return today.getFullYear();
  },
  env: process.env.ELEVENTY_ENV,
};