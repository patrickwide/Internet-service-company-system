const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Client = require("../../database/models/Client");
const ClientType = require("../types/Client");

const ClientMutation = {
    // add client
    addClient: {
        type: ClientType,
        args: {
            name:{ type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_parent, args) {
            const client = new Client({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            return client.save();
        },
    },
    // delete client
    deleteClient: {
        type: ClientType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(_parent, args) {
            return Client.findByIdAndRemove(args.id);
        }
    },
    // update client
    updateClient: {
        type: ClientType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            phone: { type: GraphQLString },
        },
        resolve(_parent, args) {
            return Client.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                    }
                },
                { new: false },
            );
        },
    },

}

module.exports = ClientMutation;