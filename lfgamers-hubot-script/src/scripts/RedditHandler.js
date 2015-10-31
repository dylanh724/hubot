import AbstractHandler from './AbstractHandler';

export default class RedditHandler extends AbstractHandler {
    running = {};

    sendPost(res, subreddit) {
        if (subreddit in running) {
            return res.send("That subreddit is already queued.");
        }

        let url = (subreddit ? "http://www.reddit.com/r/#{subreddit}/top.json" : "http://www.reddit.com/top.json");

        res.http(url).get((err, res, body) => {
            let posts, random, post;

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
            post   = posts.data.children[random].data;
            if (post.domain == 'i.imgur.com') {
                res.send("#{post.title} - http://www.reddit.com#{post.permalink}");

                return res.send(post.url);
            }

            return res.send("#{post.title} - #{post.url} - http://www.reddit.com#{post.permalink}");
        });

        this.running[subreddit] = setInterval(() => {this.sendPost(res, subreddit);}, 3600000 /* Hour */);
    }

    bindRespond() {
        this.robot.respond(/reddit\s*(start|stop|list)\s*(.+)?/i, function (res) {
            if (res.match[2]) {
                let subreddit = res.match[2].trim();

                switch (res.match[1]) {
                    case 'start':
                        return this.sendPost(res, subreddit);
                    case 'stop':
                        if (!(subreddit in running)) {
                            return res.send("That subreddit hasn't been queued.");
                        }

                        clearInterval(this.running[subreddit]);
                        delete running[subreddit];

                        return res.send("{subreddit} has been deleted from the queue.")
                    default:
                        return res.send(`${res.match[1]} is not a valid command.`);
                }
            }

            running.forEach((item) => { res.send(item); });
        });
    }

    getName() {
        return 'reddit';
    }

    getDescription() {
        return 'Reddit Top Posts Cron';
    }

    getHelp() {
        return ```
            Commands:
              hubot reddit start \<subreddit> - Returns a subreddit post immediately and every hour thereafter
              hubot reddit stop \<subreddit> - Stops the bot from returning any more stories from subreddit
              hubot reddit list - lists all queued subreddits
        ```;
    }
}