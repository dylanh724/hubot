'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _scriptsHelpHandler = require('./scripts/HelpHandler');

var _scriptsHelpHandler2 = _interopRequireDefault(_scriptsHelpHandler);

function importScript(robot, directory, script) {
    var cls = require(directory + script);

    return new cls(robot);
}

exports['default'] = function (robot) {
    var main = __dirname + '/Handler/',
        files = _fs2['default'].readdirSync(main),
        help = new _scriptsHelpHandler2['default'](robot);

    files.forEach(function (file) {
        if (file === 'AbstractHandler.js' || file === 'HelpHandler.js') {
            return;
        }

        help.addScript(importScript(robot, main, file));
    });
};

module.exports = exports['default'];
