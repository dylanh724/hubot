import AbstractSubscriberHandler from './AbstractSubscriberHandler';
import MainStore from '../Store/MainStore';
import IntervalStore from '../Store/IntervalStore';
import DiscordHelper from '../Helper/DiscordHelper';

import {Response} from 'hubot';
import {autobind} from 'core-decorators';

export default class TwitchHandler extends AbstractSubscriberHandler {
    live = this.store.get('twitch.live', []);

    @autobind
    checkResponse(room, subscriber, err, res, body) {
        let json = JSON.parse(body);

        if (json.stream === null ) {
            if (subscriber in this.live) {
                this.live.splice(this.live.indexOf(subscriber), 1);
                this.store.set('twitch.live', this.live);

                return res.send(`${subscriber} has gone offline :(`);
            }

            return;
        }

        console.log(subscriber, this.live);
        if (subscriber in this.live) {
            return;
        }

        this.live.push(subscriber);
        this.store.set('twitch.live', this.live);

        let stream = json.stream,
            name = this.buildNameFromStream(stream),
            game = stream.channel.game;

        return res.send(`${subscriber} is streaming${game !== null ? ' ' + game : ''}!\n${name}`);
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
