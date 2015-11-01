import AbstractHandler from './AbstractHandler';
import MainStore from '../Store/MainStore';
import IntervalStore from '../Store/IntervalStore';
import DiscordHelper from '../Helper/DiscordHelper';

import {Response} from 'hubot';
import {autobind} from 'core-decorators';

export default class RedditHandler extends AbstractHandler {
    get running() { return this.store.get('reddit.running', []); }

    set running(value) { return this.store.set('reddit.running', value); }

    constructor(robot, mainStore, intervalStore) {
        super(robot);

        this.store     = mainStore;
        this.intervals = intervalStore;
        this.running   = this.store.get('reddit.running', []);
        this.ensureIntervalsRunning();
    }

    ensureIntervalsRunning() {
        this.robot.logger.info(`Running reddit handler. Ensuring intervals are running.`);

        for (let index in this.running) {
            if (!this.running.hasOwnProperty(index)) {
                continue;
            }

            let data      = this.running[index],
                room      = data.room,
                subreddit = data.subreddit;

            if (!this.intervals.has('reddit.' + room + '.' + subreddit)) {
                let info = DiscordHelper.getRoomsForId(this.robot, room)[0];
                this.robot.logger.info(`Running reddit handler in "${info.name}" for /r/${subreddit}.`);
                this.run(room, subreddit);
            }
        }
    }

    isRunning(room, subreddit) {
        for (let index in this.running) {
            if (!this.running.hasOwnProperty(index)) {
                continue;
            }

            let data = this.running[index];
            if (room === data.room && subreddit === data.subreddit) {
                return true;
            }
        }

        return false;
    }

    getRunningInRoom(room) {
        let running = [];
        for (let index in this.running) {
            if (!this.running.hasOwnProperty(index)) {
                continue;
            }

            let data = this.running[index];
            if (room === data.room) {
                running.push(data.subreddit);
            }
        }

        return running;
    }

    run(room, subreddit) {
        this.running.push({room: room, subreddit: subreddit});
        this.intervals.set(
            'reddit.' + room + '.' + subreddit,
            setInterval(() => this.sendPost(room, subreddit), 3600000 /* Hour */)
        );

        this.store.set('reddit.running', this.running);
    }

    @autobind
    sendPost(room, subreddit) {
        let res = new Response(this.robot, {room: room});

        if (this.isRunning(room, subreddit)) {
            return res.send("That subreddit is already queued.");
        }

        this.run(room, subreddit);

        let url = subreddit
            ? `http://www.reddit.com/r/${subreddit}/top.json?sort=top&t=hour`
            : "http://www.reddit.com/top.json?sort=top&t=hour";
        this.robot.http(url)
            .header('Accept', 'application/json')
            .get()((err, result, body) => {
                let posts, random, post;

                if (body && body.match(/^302/) && body.match(/^302/)[0] == '302') {
                    return res.send("That subreddit does not seem to exist.");
                }

                posts = JSON.parse(body);
                if (posts.error) {
                    return res.send(`That doesn't seem to be a valid subreddit. [http response ${posts.error}]`);
                }

                if (!posts.data || !posts.data.children || posts.data.children.length <= 0) {
                    return res.send("While that subreddit exists, there does not seem to be anything there.");
                }

                random = Math.round(Math.random() * posts.data.children.length);
                post   = posts.data.children[random].data;
                if (post.domain == 'i.imgur.com') {
                    res.send(`${post.title} - http://www.reddit.com${post.permalink}`);

                    return res.send(post.url);
                }

                return res.send(`${post.title} - ${post.url} - http://www.reddit.com${post.permalink}`);
            });
    }

    stopRunning(room, subreddit) {
        for (let index in this.running) {
            if (!this.running.hasOwnProperty(index)) {
                continue;
            }

            let data = this.running[index];
            if (data.room === room && data.subreddit === subreddit) {
                delete this.running[index];
                this.intervals.delete({room: room, subreddit: subreddit});

                return true;
            }
        }

        return false;
    }

    bind() {
        this.respond(/reddit\s*(start|stop|list|clear)\s*(.+)?/i, (res) => {
            let room = res.message.room;

            // Listing
            if (undefined === res.match[2]) {
                if (res.match[1] === 'list') {
                    this.getRunningInRoom(room).forEach((item) => { res.send(item); });
                } else if (res.match[1] === 'wipe') {
                    this.getRunningInRoom(room).forEach((item) => { this.stopRunning(room, item); });
                    res.send(`${room} has been been cleared of subreddits.`)
                }
            }

            let subreddit = res.match[2].trim();

            switch (res.match[1]) {
                case 'start':
                    return this.sendPost(room, subreddit);
                case 'stop':
                    if (!this.isRunning(room, subreddit)) {
                        return res.send("That subreddit hasn't been queued.");
                    }

                    this.stopRunning(room, subreddit);

                    return res.send(`${subreddit} has been deleted from the queue.`);
                default:
                    return res.send(`${res.match[1]} is not a valid command.`);
            }
        });
    }

    getName() {
        return 'reddit';
    }

    getDescription() {
        return 'Reddit Top Posts Cron';
    }

    getHelp() {
        return `Commands:
    lfg reddit start \<subreddit> - Returns a subreddit post immediately and every hour thereafter
    lfg reddit stop \<subreddit> - Stops the bot from returning any more stories from subreddit
    lfg reddit list - lists all queued subreddits
        `;
    }
}