import AbstractHandler from './AbstractHandler';

export default class ArcherHandler extends AbstractHandler {

    static phrases = [
        {regex: /loggin/i, reply: 'call Kenny Loggins, \'cuz you\'re in the DANGER ZONE.'},
        {regex: /sitting down/i, reply: 'What?! At the table? Look, he thinks he\'s people!'},
        {regex: /^archer$/i, reply: "come out and playyyeeeayyyy"},
        {regex: /benoit/i, reply: 'balls'},
        {regex: /love/i, reply: 'And I love that I have an erection... that doesn\'t involve homeless people.'}
    ];

    fetchRandomReply() {
        let options = {
            uri:     'http://en.wikiquote.org/wiki/Archer_(TV_series)',
            headers: {
                'User-Agent': 'User-Agent: Archerbot for Hubot (+https://github.com/github/hubot-scripts)'
            }
        };

        return scraper(options, (err, jQuery) => {
            if (err) {
                throw err;
            }

            let quotes = jQuery("dl").toArray(),
                quote  = quotes[Math.floor(Math.random() * quotes.length)],
                dialog = jQuery(quote).text().trim() + "\n";

            return msg.send(dialog);
        });
    }

    getName() {
        return 'archer';
    }

    bindHear() {
        ArcherHandler.phrases.forEach((phrase) => {
            return this.robot.hear(phrase.regex, (msg) => {
                return msg.reply(typeof phrase.reply === 'string' ? phrase.reply : phrase.reply());
            });
        });
    }

    getDescription() {
        return 'Archer quoter';
    }

    getHelp() {
        return `archer has no commands.`;
    }
}