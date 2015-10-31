export default class AbstractHandler {
    constructor(robot) {
        this.robot = robot;

        this.bindRespond();
        this.bindHear();
    }

    bindRespond() {
    }

    bindHear() {
    }

    getName() {
        throw new Error("Must override this");
    }

    getDescription() {
        throw new Error("Must override this");
    }

    getHelp() {
    }
}