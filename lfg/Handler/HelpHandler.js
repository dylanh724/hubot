import AbstractHandler from './AbstractHandler';

export default class HelpHandler extends AbstractHandler {
    scripts = {};

    constructor(robot) {
        super(robot);

        this.addScript(this);
    }

    addScript(cls) {
        this.scripts[cls.getName()] = cls;
    }

    bind() {
        this.respond(
            /^help ?(.+)?/i,
            (res) => {
                if (res.match[1] !== undefined) {
                    let script = this.scripts[res.match[1]];

                    return res.send(`${script.getName()}: ${script.getDescription()}\n\`\`\`\n${script.getHelp()}\n\`\`\``);
                }

                let response = "Select a script to get help for by running `!lfg help \<script>`\n\n```\n";
                for (let name in this.scripts) {
                    if (!this.scripts.hasOwnProperty(name)) {
                        continue;
                    }

                    let script = this.scripts[name];
                    response += `${name}: ${script.getDescription()}\n`;
                }

                res.send(response+"\n```");
            }
        );
    }

    getName() {
        return 'help';
    }

    getDescription() {
        return 'LFG Help Script';
    }

    getHelp() {
        return `Commands:
lfg - Returns a list of scripts with help
lfg help - Returns a list of scripts with help
lfg help \<script> - Returns the help information for the given script
        `;
    }
}