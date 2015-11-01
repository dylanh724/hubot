import {Robot, Adapter, EnterMessage, LeaveMessage, TopicMessage, TextMessage} from 'hubot';
import {Client} from 'discord';
import {autobind} from 'core-decorators';

/**
try {
    let ref = require('hubot'), Robot = ref.Robot, Adapter = ref.Adapter, EnterMessage = ref.EnterMessage, LeaveMessage = ref.LeaveMessage, TopicMessage = ref.TopicMessage, TextMessage = ref.TextMessage;
} catch (_error) {
    prequire = require('parent-require');
    let ref1 = prequire('hubot'), Robot = ref1.Robot, Adapter = ref1.Adapter, EnterMessage = ref1.EnterMessage, LeaveMessage = ref1.LeaveMessage, TopicMessage = ref1.TopicMessage, TextMessage = ref1.TextMessage;
}
//*/


class DiscordAdapter extends Adapter {
    run() {
        this.options = {
            email: process.env.HUBOT_DISCORD_EMAIL,
            password: process.env.HUBOT_DISCORD_PASSWORD
        };

        this.client = new Client
        this.client.on('ready', this.ready);
        this.client.on('message', this.message);

        this.client.login(this.options.email, this.options.password);
    }

    ready() {
        this.robot.logger.info("Logged in as: " + this.client.user.username);
        this.robot.name = this.client.user.username.toLowerCase();
        this.robot.logger.info("Robot Name: " + this.robot.name);

        this.emit("connected");
    }

    @autobind
    message(message) {
        // Ignore messages from self
        if (message.author.id = this.client.user.id) {
            return;
        }

        let user =this.robot.brain.userForId(message.author);
        user.room = message.channel;

        this.receive(new TextMessage(user, message.content, message.id));
    }

    send(envelope, ...messages) {
        for (let msg in messages) {
            this.client.sendMessage(envelope.room, msg);
        }
    }

    reply(envelope, ...messages) {
        for (let msg in messages) {
            this.robot.logger.info("Reply");
        }
    }
}

exports.use = (robot) => new DiscordAdapter(robot);