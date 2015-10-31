import AbstractHandler from './AbstractHandler';

export default class HelpHandler extends AbstractHandler {
    scripts = {};

    addScript(cls) {
        this.scripts[cls.getName()] = cls;
    }

    bindRespond() {
        this.robot.respond(
            /lfg ?(help)? ?(.+)?/i,
            (res) => {
                console.log(res, res.match);
                if (res.match[1] !== undefined) {
                    return res.send("`" + res.match[1] + "`:\n```\n" + this.scripts[res.match[1]] + "\n```");
                }

                let response = "Select a script to get help for by running `!lfg help \<script>`\n";
                for (let name in this.scripts) {
                    if (!this.scripts.hasOwnProperty(name)) {
                        continue;
                    }

                    let script = this.scripts[name];
                    response += `    ${name}: ${script.getDescription()}\n`;
                }

                res.send(response);
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
        return `
            Commands:
              lfg - Returns a list of scripts with help
              lfg help - Returns a list of scripts with help
              lfg help \<script> - Returns the help information for the given script
        `;
    }
}