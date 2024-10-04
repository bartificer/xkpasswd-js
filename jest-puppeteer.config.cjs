module.exports = {
  launch: {
    headless: true,  // Set to 'false' to see the browser in action
    slowMo: 50,      // Slow down tests by 50ms
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  browserContext: 'default',
};
