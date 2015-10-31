"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractHandler = (function () {
    function AbstractHandler(robot) {
        _classCallCheck(this, AbstractHandler);

        this.robot = robot;

        this.bindRespond();
        this.bindHear();
    }

    _createClass(AbstractHandler, [{
        key: "bindRespond",
        value: function bindRespond() {}
    }, {
        key: "bindHear",
        value: function bindHear() {}
    }, {
        key: "getName",
        value: function getName() {
            throw new Error("Must override this");
        }
    }, {
        key: "getDescription",
        value: function getDescription() {
            throw new Error("Must override this");
        }
    }, {
        key: "getHelp",
        value: function getHelp() {}
    }]);

    return AbstractHandler;
})();

exports["default"] = AbstractHandler;
module.exports = exports["default"];
