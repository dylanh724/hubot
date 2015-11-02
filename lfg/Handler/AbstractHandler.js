export default class AbstractHandler {
    constructor(robot) {
        this.robot = robot;
    }

    bind() {
        throw new Error("Must override this");
    }

    getName() {
        throw new Error("Must override this");
    }

    getCommand() {
        return this.getName();
    }

    getDescription() {
        throw new Error("Must override this");
    }

    command(command, callback) {
        let regex = new RegExp("lfg " + this.getCommand() + " (" + command + ") *(.+)?", 'i');

        this.robot.respond(regex, callback);
    }

    respond(regex, callback) {
        return this.robot.respond(/lfg (.+)/i, (res) => {
            let str = res.match[1];

            let m;
            if ((m = regex.exec(str)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                res.match = m;

                return callback(res);
            }
        });
    }

    hear(regex, callback) {
        return this.robot.hear(regex, callback);
    }

    getHelp() {
        throw new Error("Must override this");
    }
}