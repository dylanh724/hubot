import AbstractSubscriberHandler from './AbstractSubscriberHandler';
import MainStore from '../Store/MainStore';
import IntervalStore from '../Store/IntervalStore';
import DiscordHelper from '../Helper/DiscordHelper';

import {Response} from 'hubot';
import {autobind} from 'core-decorators';

export default class TwitchHandler extends AbstractSubscriberHandler {
    live = this.store.get('twitch.live', []);

    bind() {
        super.bind();

        this.command('online', (res) => {
            let room = res.message.room,
                msg  = "The following users are currently streaming: \n```\n",
                count = 0;


            this.live.forEach((info) => {
                if (info.room === room) {
                    count++;
                    msg += `${info.subscriber}: http://www.twitch.tv/${info.subscriber}\n`;
                }
            });

            if (count === 0) {
                return res.send("There are no streamers online.")
            }

            msg += "```\n";

            res.send(msg);
        })
    }

    @autobind
    checkResponse(room, subscriber, err, res, body) {
        let json = JSON.parse(body);

        if (json.stream === null || json.stream === undefined) {
            if (this.isLive(room, subscriber) !== false) {
                this.live.splice(this.isLive(room, subscriber));
                this.store.set('twitch.live', this.live);

                return res.send(`${subscriber} has gone offline :(`);
            }

            return;
        }

        if (this.isLive(room, subscriber) !== false) {
            return;
        }

        this.live.push({room: room, subscriber: subscriber});
        this.store.set('twitch.live', this.live);

        let stream = json.stream,
            name = this.buildNameFromStream(stream),
            game = stream.channel.game;

        return res.send(`${subscriber} is streaming${game !== null ? ' ' + game : ''}!\n${name}`);
    }

    isLive(room, subscriber) {
        for (let index in this.live) {
            if (!this.live.hasOwnProperty(index)) {
                continue;
            }

            let info = this.live[index];
            if (info.room === room && info.subscriber === subscriber) {
                return index;
            }
        }

        return false;
    }

    buildNameFromStream(stream) {
        return "*" + stream.channel.status + "*: " + stream.channel.url + "\n" + stream.preview.large;
    }

    getName() {
        return 'twitch';
    }

    getDescription() {
        return 'Twitch Subscription';
    }

    getHelp() {
        return `Commands:
    lfg twitch subscribe|sub \<subscriber> - Returns a subscriber post immediately and every hour thereafter
    lfg twitch unsubscribe|unsub \<subscriber> - Stops the bot from returning any more stories from subscriber
    lfg twitch list - lists all queued subscribers
    lfg twitch clear|wipe - clear all queued subscribers
    lfg twitch online - List all online subscribers for the current room
        `;
    }

    getInterval() {
        return 30;
    }

    getUrl(subscriber) {
        return "https://api.twitch.tv/kraken/streams/" + subscriber;
    }

    setHeaders(http) {
        http
            .header('Accept', 'application/vnd.twitchtv.v3+json')
            .header('Client-ID', process.env.HUBOT_LFG_TWITCH_CLIENT_ID);
    }
}
