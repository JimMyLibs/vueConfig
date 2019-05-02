const message = require('./message.js')
const jimMock = require('./jim/index');

module.exports = (app, Mock) => {
  message(app, Mock);
  jimMock(app, Mock);
}