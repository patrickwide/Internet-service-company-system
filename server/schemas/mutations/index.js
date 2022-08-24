const { GraphQLObjectType } = require('graphql');

// Mutations
const ClientMutation = require('./Client');
const AdminMutation = require('./Admin');
const AgentMutation = require('./Agent');
const TechnicianMutation = require('./Technician');
const AccountMutation = require("./Account");
const TicketMutation = require("./Ticket");
const IssueMutation = require('./Issue');
const MessageMutation = require("./Message");
const TeamMutation = require("./Team");

const RootMutation = new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
        // Client
        signUpClient: ClientMutation.signUpClient,
        signInClient: ClientMutation.signInClient,
        deleteClient: ClientMutation.deleteClient,
        updateClient: ClientMutation.updateClient,
        
        // Admin
        addAdmin: AdminMutation.addAdmin,
        deleteAdmin: AdminMutation.deleteAdmin,
        updateAdmin: AdminMutation.updateAdmin,
        loginAdmin: AdminMutation.loginAdmin,

        // Agent
        addAgent: AgentMutation.addAgent,
        deleteAgent: AgentMutation.deleteAgent,
        updateAgent: AgentMutation.updateAgent,
        loginAgent: AgentMutation.loginAgent,

        // Technician
        addTechnician: TechnicianMutation.addTechnician,
        deleteTechnician: TechnicianMutation.deleteTechnician,
        updateTechnician: TechnicianMutation.updateTechnician,
        loginTechnician: TechnicianMutation.loginTechnician,

        // Account
        addAccount: AccountMutation.addAccount,
        deleteAccount: AccountMutation.deleteAccount,
        updateAccount: AccountMutation.updateAccount,


        // Ticket
        addTicket: TicketMutation.addTicket,
        deleteTicket: TicketMutation.deleteTicket,
        updateTicket: TicketMutation.updateTicket,

        // Issue
        addIssue: IssueMutation.addIssue,
        deleteIssue: IssueMutation.deleteIssue,
        updateIssue: IssueMutation.updateIssue,

        // // Message
        // addMessage: MessageMutation.addMessage,
        // deleteMessage: MessageMutation.deleteMessage,
        // updateMessage: MessageMutation.updateMessage,

        // Team
        addTeam: TeamMutation.addTeam,
        deleteTeam: TeamMutation.deleteTeam,
        updateTeam: TeamMutation.updateTeam,
    }
});

module.exports = RootMutation;