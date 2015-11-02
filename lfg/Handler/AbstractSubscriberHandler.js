import AbstractHandler from './AbstractHandler';
import MainStore from '../Store/MainStore';
import DiscordHelper from '../Helper/DiscordHelper';

import {Response} from 'hubot';
import {autobind} from 'core-decorators';

export default class AbstractSubscriberHandler extends AbstractHandler {
    get subscriptions() { return this._subscriptions; }

    set subscriptions(value) { return this._subscriptions = value; }

    getInterval() {
        throw Error("Must Override");
    }

    constructor(robot, mainStore, intervalStore) {
        super(robot);

        this.store         = mainStore;
        this.intervals     = intervalStore;
        this.subscriptions = this.store.get(this.getName() + '.subscriptions', []);

        this.startIntervals();
    }

    bind() {
        this.command('subscribe|sub', (res) => {
            this.subscribe(res.message.room, res.match[2]);
            res.send("Subscribed to " + res.match[2]);
        });

        this.command('unsubscribe|unsub', (res) => {
            this.unsubscribe(res.message.room, res.match[2]);
            res.send("Unsubscribed from " + res.match[2]);
        });

        this.command('list', (res) => {
            let room          = res.message.room,
                subscriptions = this.getSubscribedInRoom(room);

            if (subscriptions.length > 0) {
                let msg = "```\n";

                subscriptions.forEach((item) => {
                    msg += item + "\n";
                });
                msg += "\n```";

                return res.send(msg);
            }

            return res.send("No subscriptions have been queued.");
        });

        this.command('wipe|clear', (res) => {
            let room = res.message.room;
            let info = DiscordHelper.getRoomsForId(this.robot, room)[0];

            this.getSubscribedInRoom(room).forEach((item) => { this.unsubscribe(room, item); });
            res.send(`\`${info.name}\` has been been cleared of subscriptions.`)
        });
    }

    startIntervals() {
        this.robot.logger.info(`Running ${this.getName()} handler intervals.`);

        for (let index in this.subscriptions) {
            if (!this.subscriptions.hasOwnProperty(index)) {
                continue;
            }

            let data       = this.subscriptions[index],
                room       = data.room,
                subscriber = data.subscriber;

            if (!this.intervals.has(this.getName() + '.' + room + '.' + subscriber)) {
                let info = DiscordHelper.getRoomsForId(this.robot, room)[0];
                this.robot.logger.info(`Running ${this.getName()} handler in "${info.name}" for ${subscriber}.`);

                this.run(room, subscriber);
                this.startInterval(room, subscriber);
            }
        }
    }

    startInterval(room, subscriber) {
        this.intervals.set(
            this.getName() + '.' + room + '.' + subscriber,
            setInterval(() => this.run(room, subscriber), 1000 * this.getInterval())
        );

        this.run(room, subscriber);
    }

    stopInterval(room, subscriber) {
        this.intervals.delete(this.getName() + '.' + room + '.' + subscriber);
    }

    @autobind
    run(room, subscriber) {
        let res = new Response(this.robot, {room: room}),
            url = this.getUrl(subscriber),
            http = this.robot.http(url);

        this.setHeaders(http);

        http.get()((err, result, body) => this.checkResponse(room, subscriber, err, res, body));
    }

    /**
     * Function is used to test if the subscribed object changed,
     * and if it has, tell the user
     */
    checkResponse(room, subscriber, err, res, body) {
        throw Error("Must override");
    }

    getUrl(subscriber) {
        throw Error("Must override");
    }

    setHeaders(http) {
    }

    isSubscribed(room, subscriber) {
        for (let index in this.subscriptions) {
            if (!this.subscriptions.hasOwnProperty(index)) {
                continue;
            }

            let data = this.subscriptions[index];
            if (room === data.room && subscriber === data.subscriber) {
                return true;
            }
        }

        return false;
    }

    getSubscribedInRoom(room) {
        let subscriptions = [];
        for (let index in this.subscriptions) {
            if (!this.subscriptions.hasOwnProperty(index)) {
                continue;
            }

            let data = this.subscriptions[index];
            if (room === data.room) {
                subscriptions.push(data.subscriber);
            }
        }

        return subscriptions;
    }

    subscribe(room, subscriber) {
        this.subscriptions.push({room: room, subscriber: subscriber});
        this.store.set(this.getName() + '.subscriptions', this.subscriptions);

        this.startInterval(room, subscriber);
    }

    unsubscribe(room, subscriber) {
        for (let index in this.subscriptions) {
            if (!this.subscriptions.hasOwnProperty(index)) {
                continue;
            }

            let data = this.subscriptions[index];
            if (data.room === room && data.subscriber === subscriber) {
                this.subscriptions.splice(index, 1);

                break;
            }
        }

        this.store.set(this.getName() + '.subscriptions', this.subscriptions);

        this.stopInterval(room, subscriber);
    }
}
