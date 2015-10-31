"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _templateObject = _taggedTemplateLiteral([""], [""]),
    _templateObject2 = _taggedTemplateLiteral(["\n            Commands:\n              lfg - Returns a list of scripts with help\n              lfg help - Returns a list of scripts with help\n              lfg help <script> - Returns the help information for the given script\n        "], ["\n            Commands:\n              lfg - Returns a list of scripts with help\n              lfg help - Returns a list of scripts with help\n              lfg help \\<script> - Returns the help information for the given script\n        "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _AbstractHandler2 = require('./AbstractHandler');

var _AbstractHandler3 = _interopRequireDefault(_AbstractHandler2);

var HelpHandler = (function (_AbstractHandler) {
    _inherits(HelpHandler, _AbstractHandler);

    function HelpHandler() {
        _classCallCheck(this, HelpHandler);

        _get(Object.getPrototypeOf(HelpHandler.prototype), "constructor", this).apply(this, arguments);

        this.scripts = {};
    }

    _createClass(HelpHandler, [{
        key: "addScript",
        value: function addScript(cls) {
            this.scripts[cls.getName()] = cls;
        }
    }, {
        key: "bindRespond",
        value: function bindRespond() {
            this.robot.respond(/lfg ?(help)? ?(.+)?/gmi, function (res) {
                if (res.match[1] !== undefined) {
                    return res.send("```\n" + this.scripts[res.match[1]] + "\n```");
                }

                res.send("Select a script to get help for by running !lfg help \<script>");
                this.scripts.forEach(function (script, name) {
                    res.send("    " + name + ": " + script.getDescription());
                });
            });
        }
    }, {
        key: "getName",
        value: function getName() {
            return 'help';
        }
    }, {
        key: "getDescription",
        value: function getDescription() {
            return 'LFG Help Script';
        }
    }, {
        key: "getHelp",
        value: function getHelp() {
            return ""(_templateObject2)(_templateObject);
        }
    }]);

    return HelpHandler;
})(_AbstractHandler3["default"]);

exports["default"] = HelpHandler;
module.exports = exports["default"];
