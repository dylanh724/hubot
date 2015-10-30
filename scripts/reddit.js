// Description:
//   Reddit Top Posts Cron
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot reddit start <subreddit> - Returns a subreddit post immediately and every hour thereafter
//   hubot reddit stop <subreddit> - Stops the bot from returning any more stories from subreddit
//   hubot reddit list - lists all queued subreddits

module.exports = function(robot) {

    var running = {};

    function sendPost(robot, res, subreddit) {
        var url = (subreddit ? "http://www.reddit.com/r/"+subreddit+"/top.json" : "http://www.reddit.com/top.json");
        robot.http(url).get( function(err, r, body) {
            if (!body) {
                console.log(r)
                return;
            }
            if (body && body.match(/^302/) && body.match(/^302/)[0] =='302') {
                res.send("That subreddit does not seem to exist.");
                return;
            }
            var posts = JSON.parse(body);
            if (posts.error) {
                res.send("That doesn't seem to be a valid subreddit. [http response "+posts.error+"]");
                return;
            }
            if (!posts.data || !posts.data.children || posts.data.children.length <= 0) {
                res.send("While that subreddit exists, there does not seem to be anything there.");
                return;
            }
            var random = Math.round(Math.random() * posts.data.children.length);
            var post = posts.data.children[random].data;
            if (post.domain == 'i.imgur.com') {
                res.send(post.title+" - http://www.reddit.com"+post.permalink);
                res.send(post.url);
            } else {
                res.send(post.title+" - "+post.url+" - http://www.reddit.com"+post.permalink);
            }
        });
    }

    robot.respond(/redditnews\s*(start|stop|list)\s*(.+)?/i, function(res){
        
        /* Case: !reddit start <subreddit> */
        if (res.match[1] === 'start' && res.match[2]) {
            var subreddit = res.match[2].trim();
            if (subreddit in running) {
                res.send("That subreddit is already queued.");
                return;
            }
            sendPost(robot, res, subreddit);
            running[subreddit] = setInterval( function() {
                sendPost(robot, res, subreddit);
            }, 3600000 /* hourly */);

        /* Case !reddit stop <subreddit> */
        } else if (res.match[1] === 'stop' && res.match[2]) {
            var subreddit = res.match[2].trim();
            if (!(subreddit in running)) {
                res.send("That subreddit hasn't been queued.");
                return;
            }
            clearInterval(running[subreddit]);
            delete running[subreddit];
            res.send(subreddit+" has been deleted from the queue.")
            return;

        /* Case !reddit list */
        } else if (res.match[1] === 'list') {
            running.forEach(function(item) {
                res.send(item);
            });
        }
    });
}

