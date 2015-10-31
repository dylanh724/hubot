import AbstractHandler from './AbstractHandler';

export default class HelpHandler extends AbstractHandler {
    scripts = {};

    addScript(cls) {
        this.scripts[cls.getName()] = cls;
    }

    bindRespond() {
        this.robot.respond(
            /lfg ?(help)? ?(.+)?/gmi,
            (res) => {
                if (res.match[1] !== undefined) {
                    return res.send("```\n" + this.scripts[res.match[1]] + "\n```");
                }

                res.send("Select a script to get help for by running `!lfg help \<script>`");
                for (let name in this.scripts) {
                    if (!scripts.hasOwnProperty(name)) {
                        continue;
                    }

                    let script = scripts[name];
                    res.send(`    ${name}: ${script.getDescription()}`);
                }
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
        return ```
            Commands:
              lfg - Returns a list of scripts with help
              lfg help - Returns a list of scripts with help
              lfg help \<script> - Returns the help information for the given script
        ```;
    }
}