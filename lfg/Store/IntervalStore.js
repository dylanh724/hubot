import MainStore from './MainStore';


/**
 * Non-persistent store. Holds `setInterval` calls
 */
export default class IntervalStore extends MainStore {
    get prefix() { return 'lfg.interval'; }
}
