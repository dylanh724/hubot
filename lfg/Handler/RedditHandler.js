import AbstractSubscriberHandler from './AbstractSubscriberHandler';
import MainStore from '../Store/MainStore';
import IntervalStore from '../Store/IntervalStore';
import DiscordHelper from '../Helper/DiscordHelper';

import {Response} from 'hubot';
import {autobind} from 'core-decorators';

export default class RedditHandler extends AbstractSubscriberHandler {
    lastPosts = this.store.get('reddit.lastPosts', {});

    getName() {
        return 'reddit';
    }

    getDescription() {
        return 'Reddit Top Posts Cron';
    }

    getHelp() {
        return `Commands:
    lfg reddit subscribe|sub \<subreddit> - Returns a subreddit post immediately and every hour thereafter
    lfg reddit unsubscribe|unsub \<subreddit> - Stops the bot from returning any more stories from subreddit
    lfg reddit list - lists all queued subreddits
    lfg reddit clear|wipe - clear all queued subreddits
        `;
    }

    getInterval() {
        return 60 * 60;
    }

    getUrl(subscriber) {
        return `http://www.reddit.com/r/${subscriber}/top.json?sort=top&t=hour`;
    }

    setHeaders(http) {
        http.header('Accept', 'application/json');
    }

    @autobind
    checkResponse(room, subscriber, err, res, body) {
        if (body && body.match(/^302/) && body.match(/^302/)[0] == '302') {
            return res.send("That subreddit does not seem to exist.");
        }

        let posts = JSON.parse(body);
        if (posts.error || err) {
            return res.send(`${subscriber} doesn't seem to be a valid subreddit. [http response ${posts.error}]`);
        }

        if (!posts.data || !posts.data.children || posts.data.children.length <= 0) {
            return res.send(`While ${subscriber} exists, there does not seem to be anything there.`);
        }

        let post = posts.data.children[0].data;
        if (post === this.lastPosts[room + subscriber]) {
            return false;
        }

        this.lastPosts[room + subscriber] = post;
        this.store.set('reddit.lastPosts', this.lastPosts);

        if (post.domain == 'i.imgur.com') {
            res.send(`${post.title} - http://www.reddit.com${post.permalink}`);

            return res.send(post.url);
        }

        return res.send(`${post.title} - ${post.url} - http://www.reddit.com${post.permalink}`);
    }
}
