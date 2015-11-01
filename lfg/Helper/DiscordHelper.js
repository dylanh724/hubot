export default class DiscordHelper {
    static getDiscord(robot) {
        return robot.adapter.client;
    }

    static getRoomsForId(robot, roomId) {
        let discord = DiscordHelper.getDiscord(robot),
            rooms = [];

        DiscordHelper.forEachServer(discord, (server) => {
            for (let id in server.channels) {
                if (id === roomId) {
                    let name = server.name + ' - ' + server.channels[id].name;
                    rooms.push({name: name, server: server, room: server.channels[id]});
                }
            }
        });

        return rooms;
    }

    static forEachServer(discord, callback) {
        for (let id in discord.servers) {
            if (discord.servers.hasOwnProperty(id)) {
                callback(discord.servers[id]);
            }
        }
    }
}