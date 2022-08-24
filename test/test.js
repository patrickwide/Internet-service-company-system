const chai = require('chai');
const expect = chai.expect;
const url = 'http://localhost:5000/';
const request = require('supertest')(url);
const mongoose = require("mongoose");

const ClientSchema = require('../server/database/models/Client');
const AdminSchema = require('../server/database/models/Admin');
const AgentSchema = require('../server/database/models/Agent');
const TechnicianSchema = require('../server/database/models/Technician');
const AccountSchema = require("../server/database/models/Account");
const TicketSchema = require("../server/database/models/Ticket");
const IssueSchema = require('../server/database/models/Issue');
const MessageSchema = require("../server/database/models/Message");

describe('GraphQL', () => {
    
    it("Delete database!", (done) => {
        mongoose.deleteModel('Client', ClientSchema);
        mongoose.deleteModel('Admin', AdminSchema);
        mongoose.deleteModel('Agent', AgentSchema);
        mongoose.deleteModel('Technician', TechnicianSchema);
        mongoose.deleteModel('Account', AccountSchema);
        mongoose.deleteModel('Ticket', TicketSchema);
        mongoose.deleteModel('Issue', IssueSchema);
        mongoose.deleteModel('Message', MessageSchema);
        done();
    });

    let DEFAULT_ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjJmZjQ0OGQwMjJjMzMzZGRlOTUzNDhhIiwiaWF0IjoxNjYwODk2Mzk3fQ.kc5oYaB7zY5PSTN8HpqVseiT3vZLeMfo_80kx3kH_KU";

    // Add admin
    let admin;
    it('Add admin', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addAdmin(name:"admin1", email:"admin1@gmail.com", phone:"1111-1111-1111", password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            admin = res.body.data.addAdmin.id;
            console.log(res.body);
            done();
        });
    });

    // Login admin
    let ADMIN_TOKEN;
    it('Login admin', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  loginAdmin(email:"admin1@gmail.com", password:"123456789") { id name email phone token } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            ADMIN_TOKEN = res.body.data.loginAdmin.token;
            console.log(res.body);
            done();
        });
    });

    // View admins
    it('View admins', (done) => {
        request.post('graphql')
        .send({ query: `query {  admins{ id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // View admin
    it('View admin', (done) => {
        request.post('graphql')
        .send({ query: `query {  admin(id: "${admin}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Update admin with the default admin token
    it('Update admin [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateAdmin(id:"${admin}", name:"admin2", email:"admin2@gmail.com", phone:"2222-2222-2222", new_password:"987654321", current_password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });
    
    // Update admin with the admin token    
    it('Update admin [ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateAdmin(id:"${admin}", name:"admin1", email:"admin1@gmail.com", phone:"1111-1111-1111", new_password:"123456789", current_password:"987654321") { id name email phone } }` })
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });


    // SignUp Client
    let client;
    it('SignUp client', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  signUpClient(name:"client1", email:"client1@gmail.com", phone:"2222-2222-2222", password:"123456789") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            client = res.body.data.signUpClient.id;
            console.log(res.body);
            done();
        });
    });

    // SignIn client
    let CLIENT_TOKEN;
    it('SignIn client', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  signInClient(email:"client1@gmail.com", password:"123456789") { id name email phone token } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            CLIENT_TOKEN = res.body.data.signInClient.token;
            console.log(res.body);
            done();
        });
    });

    // View clients
    it('View clients', (done) => {
        request.post('graphql')
        .send({ query: `query {  clients { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // View client
    it('View client', (done) => {
        request.post('graphql')
        .send({ query: `query {  client(id: "${client}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Update client with the default admin token
    it('Update client [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateClient(id:"${client}", name:"client2", email:"client2@gmail.com", phone:"2222-2222-2222", new_password:"987654321", current_password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });
    
    // Update client with the client token    
    it('Update client [CLIENT_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateClient(id:"${client}", name:"client1", email:"client1@gmail.com", phone:"1111-1111-1111", new_password:"123456789", current_password:"987654321") { id name email phone } }` })
        .set('Authorization', `Bearer ${CLIENT_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });


    // Add agent
    let agent;
    it('Add agent', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addAgent(name:"agent1", email:"agent1@gmail.com", phone:"4444-4444-4444", password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            agent = res.body.data.addAgent.id;
            console.log(res.body);
            done();
        });
    });

    // Login agent
    let AGENT_TOKEN;
    it('Login agent', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  loginAgent(email:"agent1@gmail.com", password:"123456789") { id name email phone token } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            AGENT_TOKEN = res.body.data.loginAgent.token;
            console.log(res.body);
            done();
        });
    });

    // View agents
    it('View agents', (done) => {
        request.post('graphql')
        .send({ query: `query {  agents { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // View single agent
    it('View agent', (done) => {
        request.post('graphql')
        .send({ query: `query {  agent(id: "${agent}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Update agent [DEFAULT_ADMIN_TOKEN]
    it('Update agent [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateAgent(id:"${agent}", name:"agent2", email:"agent2@gmail.com", phone:"2222-2222-2222", new_password:"987654321", current_password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });
    
    // Update agent [AGENT_TOKEN] 
    it('Update agent [AGENT_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateAgent(id:"${agent}", name:"agent1", email:"agent1@gmail.com", phone:"1111-1111-1111", new_password:"123456789", current_password:"987654321") { id name email phone } }` })
        .set('Authorization', `Bearer ${AGENT_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });


    // Add technician
    let technician;
    it('Add technician', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addTechnician(name:"technician1", email:"technician1@gmail.com", phone:"1111-1111-1111", password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            technician = res.body.data.addTechnician.id;
            console.log(res.body);
            done();
        });
    });

    // Login technician
    let TECHNICIAN_TOKEN;
    it('Login technician', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  loginTechnician(email:"technician1@gmail.com", password:"123456789") { id name email phone token } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            TECHNICIAN_TOKEN = res.body.data.loginTechnician.token;
            console.log(res.body);
            done();
        });
    });

    // View technicians
    it('View technicians', (done) => {
        request.post('graphql')
        .send({ query: `query {  technicians { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });
    
    // View technician
    it('View technician', (done) => {
        console.log();
        request.post('graphql')
        .send({ query: `query {  technician(id: "${technician}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Update technician [DEFAULT_ADMIN_TOKEN]
    it('Update technician [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateTechnician(id:"${technician}", name:"technician2", email:"technician2@gmail.com", phone:"2222-2222-2222", new_password:"987654321", current_password:"123456789") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Update technician [TECHNICIAN_TOKEN]
    it('Update technician [TECHNICIAN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateTechnician(id:"${technician}", name:"technician1", email:"technician1@gmail.com", phone:"1111-1111-1111", new_password:"123456789", current_password:"987654321") { id name email phone } }` })
        .set('Authorization', `Bearer ${TECHNICIAN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Add account [DEFAULT_ADMIN_TOKEN]
    let account;
    it('Add account [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation { addAccount(account_number: "11111", client: "${client}", location: "11111111-11111111-11111111-11111111", agent: "${agent}") { id account_number client { id name email phone } location agent { id name email phone } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            account = res.body.data.addAccount.id;
            console.log(res.body.data);
            done();
        });
    });

    // View accounts
    it('View accounts', (done) => {
        request.post('graphql')
        .send({ query: `query {  accounts { id account_number client { id name email phone } location agent { id name email phone } } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });
    
    // View account
    it('View account', (done) => {
        console.log();
        request.post('graphql')
        .send({ query: `query {  account(id: "${account}") { id account_number client { id name email phone } location agent { id name email phone } } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Update account
    it('Update account [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  updateAccount(id:"${account}", account_number: "22222", location: "22222222-22222222-22222222-22222222") { id account_number client { id name email phone } location agent { id name email phone } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Add ticket
    let ticket;
    it('Add ticket', (done) => {
        request.post('graphql')
        .send({ query: `mutation { addTicket(account:"${account}",category:install,client_available_date:"3399-9090-6309",client_available_time:"3399-9090-6309",note:"Hello world") { id account { id account_number client { id name email phone } location agent { id name email phone } } category client_available_date client_available_time status note } }` })
        .set('Authorization', `Bearer ${AGENT_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            ticket = res.body.data.addTicket.id;
            console.log(res.body.data);
            done();
        });
    });

    // View tickets
    it('View tickets', (done) => {
        request.post('graphql')
        .send({ query: `query { tickets {  id account { id account_number client { id name email phone } location agent { id name email phone } } category client_available_date client_available_time status note } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // View ticket
    it('View ticket', (done) => {
        request.post('graphql')
        .send({ query: `query { ticket(id:"${ticket}") {  id account { id account_number client { id name email phone } location agent { id name email phone } } category client_available_date client_available_time status note } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Update ticket [TECHNICIAN_TOKEN]
    it('Update ticket [TECHNICIAN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation { updateTicket(id:"${ticket}", status:done) {  id account { id account_number client { id name email phone } location agent { id name email phone } } category client_available_date client_available_time status note } }` })
        .set('Authorization', `Bearer ${TECHNICIAN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Add team
    let team;
    it('Add team', (done) => {
        request.post('graphql')
        .send({ query: `mutation { addTeam(name:"team1", category:install, technicians:["${technician}"]) { id name category technicians { id name email phone } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            team = res.body.data.addTeam.id;
            console.log(res.body.data);
            done();
        });
    });

    // View teams
    it('View teams', (done) => {
        request.post('graphql')
        .send({ query: `query { teams { id name category technicians { id name email phone } } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // View team
    it('View team', (done) => {
        request.post('graphql')
        .send({ query: `query { team(id:"${team}") { id name category technicians { id name email phone } } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Update team
    it('Update team', (done) => {
        request.post('graphql')
        .send({ query: `mutation { updateTeam(id:"${team}", category:shift) { id name category technicians { id name email phone } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Add issue
    let issue;
    it('Add issue', (done) => {
        request.post('graphql')
        .send({ query: `mutation { addIssue(body:"Hello world 1") { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            issue = res.body.data.addIssue.id;
            console.log(res.body.data);
            done();
        });
    });

    it('View issue', (done) => {
        request.post('graphql')
        .send({ query: `query { issues { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    it('View issue', (done) => {
        request.post('graphql')
        .send({ query: `query { issue(id:"${issue}") { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    it('Update issue', (done) => {
        request.post('graphql')
        .send({ query: `mutation { updateIssue(id:"${issue}", body:"Hello world 2") { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });


    // // Add message
    // let message;
    // it('Add message', (done) => {
    //     request.post('graphql')
    //     .send({ query: `mutation { addMessage() { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
    //     .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         message = res.body.data.addMessage.id;
    //         console.log(res.body.data);
    //         done();
    //     });
    // });

    // it('View message', (done) => {
    //     request.post('graphql')
    //     .send({ query: `query { messages { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
    //     .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         console.log(res.body.data);
    //         done();
    //     });
    // });

    // it('View issue', (done) => {
    //     request.post('graphql')
    //     .send({ query: `query { message(id:"${message}") { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
    //     .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         console.log(res.body.data);
    //         done();
    //     });
    // });

    // it('Update issue', (done) => {
    //     request.post('graphql')
    //     .send({ query: `mutation { updateMessage(id:"${message}") { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
    //     .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         console.log(res.body.data);
    //         done();
    //     });
    // });




    // Delete admin
    it('Delete admin', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  deleteAdmin(id:"${admin}") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Delete client
    it('Delete client', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  deleteClient(id:"${client}") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Delete agent
    it('Delete agent', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  deleteAgent(id:"${agent}") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Delete technician
    it('Delete technician', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  deleteTechnician(id:"${technician}") { id name email phone } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
    });

    // Delete account [DEFAULT_ADMIN_TOKEN]
    it('Delete account [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteAccount(id: "${account}") { id account_number client { id name email phone } location agent { id name email phone } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Delete ticket [DEFAULT_ADMIN_TOKEN]
    it('Delete ticket [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteTicket(id:"${ticket}") { id account { id account_number client { id name email phone } location agent { id name email phone } } category client_available_date client_available_time status note } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Delete team [DEFAULT_ADMIN_TOKEN]
    it('Delete team [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteTeam(id:"${team}") { id name category technicians { id name email phone } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });

    // Delete issue [DEFAULT_ADMIN_TOKEN]
    it('Delete issue [DEFAULT_ADMIN_TOKEN]', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteIssue(id:"${issue}") { id sender { ...on AgentType { id name email phone } ...on  ClientType{ id name email phone } ...on  AdminType{ id name email phone } ...on  TechnicianType{ id name email phone } } } }` })
        .set('Authorization', `Bearer ${DEFAULT_ADMIN_TOKEN}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body.data);
            done();
        });
    });




    // let ticket;
    // it('Add ticket', (done) => {

    //     request.post('graphql')
    //     .send({ query: `
    //         mutation {
    //             addAccount(account_no: "222-222-222", client_id: "${client}", location: "4000-4444-4000", agent_id: "${agent}") {
    //                 id
    //                 account_no
    //                 client {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //                 location
    //                 agent {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //             }
    //         }
    //     ` })
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         account = res.body.data.addAccount.id;
    //         // console.log(res.body.data);
    //     });

    //     request.post('graphql')
    //     .send({ query: `mutation {  addTechnician(name:"technician1", email:"technician1@gmail.com", phone:"5555-5555-5555") { id name email phone } }` })
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         technician = res.body.data.addTechnician.id;
    //         // console.log(res.body.data);
    //     });


    //     request.post('graphql')
    //     .send({ query: `
    //         mutation {
    //             addTicket(account_id:"${account}",category:install,client_available_date:"3399-9090-6309",client_available_time:"3399-9090-6309",note:"Hello world",technician_id:"${technician}") {
                    // id
                    // account {
                    //     id
                    //     account_no
                    //     client {
                    //         id
                    //         name
                    //         email
                    //         phone
                    //     }
                    //     location
                    //     agent {
                    //         id
                    //         name
                    //         email
                    //         phone
                    //     }
                    // }
                    // category
                    // client_available_date
                    // client_available_time
                    // note
    //                 technician {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //             }
    //         }
    //     ` })
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         ticket = res.body.data.addTicket.id;
    //         // console.log(res.body.data);
    //         done();
    //     });
    // });

    // it('Return all tickets.', (done) => {
    //     request.post('graphql')
    //     .send({ query: `
    //     { 
    //         tickets { 
    //             account {
    //                 id
    //                 account_no
    //                 client {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //                 location
    //                 agent {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //             }
    //             category
    //             client_available_date
    //             client_available_time
    //             note
    //             technician {
    //                 id
    //                 name
    //                 email
    //                 phone
    //             }
    //         } 
    //     }
    //     ` })
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         // console.log(res.body.data);
    //         done();
    //     });
    // });

    // it('Return a single ticket.', (done) => {
    //     request.post('graphql')
    //     .send({ query: `
    //     { 
    //         ticket(id: "${ticket}") { 
    //             account {
    //                 id
    //                 account_no
    //                 client {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //                 location
    //                 agent {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //             }
    //             category
    //             client_available_date
    //             client_available_time
    //             note
    //             technician {
    //                 id
    //                 name
    //                 email
    //                 phone
    //             }
    //         }
    //     }
    //     ` })
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         // console.log(res.body.data);
    //         done();
    //     });
    // });

    // it('Delete ticket.', (done) => {
    //     request.post('graphql')
    //     .send({ query: `
    //     mutation { 
    //         deleteTicket(id: "${ticket}") { 
    //             account {
    //                 id
    //                 account_no
    //                 client {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //                 location
    //                 agent {
    //                     id
    //                     name
    //                     email
    //                     phone
    //                 }
    //             }
    //             category
    //             client_available_date
    //             client_available_time
    //             note
    //             technician {
    //                 id
    //                 name
    //                 email
    //                 phone
    //             }
    //         }
    //     }
    //     ` })
    //     .expect(200)
    //     .end((err, res) => {
    //         if (err) return done(err);
    //         // console.log(res.body.data);
    //         done();
    //     });
    // });

});


// const request = require('supertest');
// const express = require('express');

// const app = express();

// const TOKEN = 'some_token';

// describe('POST /some-url', function() {
//   it('does something', function(done) {
//     request(app)
//       .post('/some-url')
//       .send({ body: 'some-body' })
//       .set('Authorization', `Bearer ${TOKEN}`)
//       .expect(200, done);
//   });
// });