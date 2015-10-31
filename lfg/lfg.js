import fs from 'fs';
import HelpHandler from './Helper/HelpHandler.js';

function importScript(robot, directory, script) {
    let cls = require(directory + script);

    return new cls(robot);
}

export default function(robot) {
    let main  = __dirname + '/Handler/',
        files = fs.readdirSync(main),
        help  = new HelpHandler(robot);

    files.forEach((file) => {
        if (file === 'AbstractHandler.js' || file === 'HelpHandler.js') {
            return;
        }

        help.addScript(importScript(robot, main, file));
    });
}