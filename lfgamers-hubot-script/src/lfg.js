import fs from 'fs';
import HelpHandler from './scripts/HelpHandler';

function importScript(robot, directory, script) {
    return new require(directory + script)(robot);
}

export default function(robot) {
    let main  = __dirname + '/scripts/',
        files = fs.readdirSync(main),
        help  = new HelpHandler(robot);

    files.forEach((file) => {
        if (file === 'AbstractHandler.js' || file === 'HelpHandler.js') {
            return;
        }

        help.addScript(importScript(robot, main, file));
    });
}