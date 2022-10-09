module.exports = {
  currentYear() {
    const today = new Date();
    return today.getFullYear();
  },
  env: process.env.ELEVENTY_ENV,
};