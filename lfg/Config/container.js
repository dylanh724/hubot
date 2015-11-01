import MainStore from '../Store/MainStore';
import IntervalStore from '../Store/IntervalStore';

import ArcherHandler from '../Handler/ArcherHandler';
import HelpHandler from '../Handler/HelpHandler';
import RedditHandler from '../Handler/RedditHandler';

export default (robot) => {
    return {
        services:   {
            robot:       {
                reference: robot
            },
            store:            {
                module: MainStore,
                args: [
                    {$ref: 'robot'}
                ]
            },
            'store.interval':    {
                module: IntervalStore
            },
            'handler.archer':    {
                module: ArcherHandler,
                args:   [
                    {$ref: 'robot'}
                ],
                tags: ['handler']
            },
            'handler.help':      {
                module: HelpHandler,
                args:   [
                    {$ref: 'robot'}
                ],
                tags:   ['handler']
            },
            'handler.reddit':      {
                module: RedditHandler,
                args:   [
                    {$ref: 'robot'},
                    {$ref: 'store'},
                    {$ref: 'store.interval'}
                ],
                tags:   ['handler']
            }
        }
    };
};