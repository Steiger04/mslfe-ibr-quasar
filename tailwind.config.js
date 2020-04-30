const colors = require('./src/css/colors')

module.exports = {
  prefix: 'tw-',
  theme: {
    extend: {
      colors
    }
  },
  variants: {
    margin: ['first', 'last'],
    padding: ['first', 'last']
  },
  plugins: []
}
