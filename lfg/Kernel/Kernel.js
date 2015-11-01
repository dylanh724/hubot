import {ContainerBuilder} from 'crate-js';

import config from '../Config/container';

export default class Kernel {
    get robot() { return this._robot; }

    set robot(value) { this._robot = value; }

    get container() { return this._container; }

    set container(value) { this._container = value; }

    constructor(robot) {
        this.robot = robot;
        this.container = ContainerBuilder.buildFromJson(config(this.robot));
    }

    run() {
        this.addHandlersToHelp();
    }

    addHandlersToHelp() {
        let help       = this.container.get('handler.help'),
            serviceIds = this.container.findTaggedServiceIds('handler');

        for (let index in serviceIds) {
            if (serviceIds.hasOwnProperty(index)) {
                let script = this.container.get(serviceIds[index]);
                help.addScript(script);

                script.bind();
            }
        }
    }
}