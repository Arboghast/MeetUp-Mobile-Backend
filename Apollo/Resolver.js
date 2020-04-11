module.exports = {
    Query: {
        users:(_,__,{dataSources}) =>{
            return dataSources.Database.allUsers();
        },
        user:(_,{id},{dataSources}) =>{
            return dataSources.Database.findUser(id);
        },
        group:(_,{id},{dataSources}) =>{
            return dataSources.Database.findGroup(id);
        },
        pathsOfGroup: async(_,{id},{dataSources})=>{
            let data = dataSources.Database.findGroup(id,true);
            let group = data[0].dataValues;
            let users = data[0].Users;
            let paths = [];

            for(let i = 0; i < users.length; i++)
            {
                let apiParams = {
                    group: {
                        latitude: group.lat,
                        longitude: group.long
                    },
                    user: {
                        latitude: users[i].dataValues.lat,
                        longitude: users[i].dataValues.long
                    }
                }
                let response = await dataSources.Google.getRouteAndETA(apiParams);
                paths.push(response);
            }
            return paths;
        }
    },

    Mutation: {
        deleteGroup:(_,{id},{dataSources})=>{
            return dataSources.Database.deleteGroup(id);
        },
        addToGroup:(_,{userId, groupId},{dataSources}) =>{
            return dataSources.Database.addToGroup(userId,groupId);
        },
        removeFromUser:(_,{invId,userId},{dataSources})=>{
            return dataSources.Database.removeFromUser(invId,userId);
        },
        addGroup:(_,{name, latitude,longitude},{dataSources})=>{
            return dataSources.Database.createGroup(name,latitude,longitude);
        },
        addInvitation:(_,{sender,group},{dataSources})=>{
            return dataSources.Database.createInvitation(sender,group);
        }
    }
}