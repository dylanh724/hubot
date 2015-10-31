"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractHandler2 = require('./AbstractHandler');

var _AbstractHandler3 = _interopRequireDefault(_AbstractHandler2);

var RedditHandler = (function (_AbstractHandler) {
    _inherits(RedditHandler, _AbstractHandler);

    function RedditHandler() {
        _classCallCheck(this, RedditHandler);

        _get(Object.getPrototypeOf(RedditHandler.prototype), "constructor", this).apply(this, arguments);

        this.running = {};
    }

    _createClass(RedditHandler, [{
        key: "sendPost",
        value: function sendPost(res, subreddit) {
            var _this = this;

            if (subreddit in running) {
                return res.send("That subreddit is already queued.");
            }

            var url = subreddit ? "http://www.reddit.com/r/#{subreddit}/top.json" : "http://www.reddit.com/top.json";

            res.http(url).get(function (err, res, body) {
                var posts = undefined,
                    random = undefined,
                    post = undefined;

                if (body && body.match(/^302/) && body.match(/^302/)[0] == '302') {
                    return res.send("That subreddit does not seem to exist.");
                }

                posts = JSON.parse(body);
                if (posts.error) {
                    return res.send("That doesn't seem to be a valid subreddit. [http response #{posts.error}]");
                }

                if (!posts.data || !posts.data.children || posts.data.children.length <= 0) {
                    return res.send("While that subreddit exists, there does not seem to be anything there.");
                }

                random = Math.round(Math.random() * posts.data.children.length);
                post = posts.data.children[random].data;
                if (post.domain == 'i.imgur.com') {
                    res.send("#{post.title} - http://www.reddit.com#{post.permalink}");

                    return res.send(post.url);
                }

                return res.send("#{post.title} - #{post.url} - http://www.reddit.com#{post.permalink}");
            });

            this.running[subreddit] = setInterval(function () {
                _this.sendPost(res, subreddit);
            }, 3600000 /* Hour */);
        }
    }, {
        key: "bindRespond",
        value: function bindRespond() {
            this.robot.respond(/reddit\s*(start|stop|list)\s*(.+)?/i, function (res) {
                if (res.match[2]) {
                    var subreddit = res.match[2].trim();

                    switch (res.match[1]) {
                        case 'start':
                            return this.sendPost(res, subreddit);
                        case 'stop':
                            if (!(subreddit in running)) {
                                return res.send("That subreddit hasn't been queued.");
                            }

                            clearInterval(this.running[subreddit]);
                            delete running[subreddit];

                            return res.send("{subreddit} has been deleted from the queue.");
                        default:
                            return res.send(res.match[1] + " is not a valid command.");
                    }
                }

                running.forEach(function (item) {
                    res.send(item);
                });
            });
        }
    }, {
        key: "getName",
        value: function getName() {
            return 'reddit';
        }
    }, {
        key: "getDescription",
        value: function getDescription() {
            return 'Reddit Top Posts Cron';
        }
    }, {
        key: "getHelp",
        value: function getHelp() {
            return "\n            Commands:\n              hubot reddit start <subreddit> - Returns a subreddit post immediately and every hour thereafter\n              hubot reddit stop <subreddit> - Stops the bot from returning any more stories from subreddit\n              hubot reddit list - lists all queued subreddits\n        ";
        }
    }]);

    return RedditHandler;
})(_AbstractHandler3["default"]);

exports["default"] = RedditHandler;
module.exports = exports["default"];
