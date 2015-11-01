export default class MainStore {
    get prefix() { return 'lfg.'; }

    get brain() { return this._brain; }

    set brain(value) { this._brain = value; }

    constructor(robot) {
        this.brain = robot !== undefined ? robot.brain : new Map();
    }

    get(key, defaultValue = undefined) {
        key = this.prefix + key;

        let value = this.brain.get(key);

        return value === undefined || value === null ? defaultValue : value;
    }

    set(key, value) {
        key = this.prefix + key;

        return this.brain.set(key, value);
    }

    delete(key) {
        return this.brain.set(key, undefined);
    }

    has(key) {
        key = this.prefix + key;

        return this.brain.get(key) !== undefined;
    }

    userForName() {
        return this.brain.userForName.call(this.brain, arguments);
    }

    userForId() {
        return this.brain.userForId.call(this.brain, arguments);
    }

    userForFuzzyName() {
        return this.brain.userForFuzzyName.call(this.brain, arguments);
    }

    usersForFuzzyName() {
        return this.brain.usersForFuzzyName.call(this.brain, arguments);
    }

    getPrefix
}
