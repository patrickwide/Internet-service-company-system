// schemas
const { ClientQuery } = require("./Client");
const { AdminQuery } = require("./Admin");
const { AgentQuery } = require("./Agent");
const { AccountQuery } = require("./Account");
const { TechnicianQuery } = require("./Technician");
const { TicketQuery } = require("./Ticket");
const { IssueQuery } = require("./Issue");

const {
    GraphQLObjectType, 
} = require('graphql');

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        // Client
        clients: ClientQuery.clients,
        client: ClientQuery.client,

        // Admin
        admins: AdminQuery.admins,
        admin: AdminQuery.admin,

        // Agent
        agents: AgentQuery.agents,
        agent: AgentQuery.agent,

        // Technician
        technicians:TechnicianQuery.technicians,
        technician:TechnicianQuery.technician,

        // Account
        accounts: AccountQuery.accounts,
        account: AccountQuery.account,
        
        // Ticket
        tickets: TicketQuery.tickets,
        ticket: TicketQuery.ticket,

        // Issue
        issues: IssueQuery.issues,
        issue: IssueQuery.issue,
    },
});

module.exports = RootQuery;