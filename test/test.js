const chai = require('chai');
const expect = chai.expect;
const url = 'http://localhost:5000/';
const request = require('supertest')(url);
const mongoose = require("mongoose");

const ClientSchema = require('../server_2/database/models/Client');
const AdminSchema = require('../server_2/database/models/Admin');
const AgentSchema = require('../server_2/database/models/Agent');
const TechnicianSchema = require('../server_2/database/models/Technician');
const AccountSchema = require("../server_2/database/models/Account");
const TicketSchema = require("../server_2/database/models/Ticket");
const IssueSchema = require('../server_2/database/models/Issue');
const MessageSchema = require("../server_2/database/models/Message");

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

    let client;
    it('Add client', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addClient(name:"client1", email:"client1@gmail.com", phone:"2222-2222-2222") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            client = res.body.data.addClient.id;
            // console.log(res.body.data.addClient.id);
            done();
        });
    });
    
    it('Return all clients.', (done) => {
        request.post('graphql')
        .send({ query: `{ clients { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Return a single client.', (done) => {
        request.post('graphql')
        .send({ query: `{ client(id: "${client}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.client);
            done();
        });
    });

    it('Delete client.', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteClient(id: "${client}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.client);
            done();
        });
    });

    let  admin;
    it('Add admin', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addAdmin(name:"admin1", email:"admin1@gmail.com", phone:"3333-3333-3333") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            admin = res.body.data.addAdmin.id;
            // console.log(res.body.data);
            done();
        });
    });

    it('Return all admins.', (done) => {
        request.post('graphql')
        .send({ query: `{ admins { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Return a single admin.', (done) => {
        request.post('graphql')
        .send({ query: `{ admin(id: "${admin}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.admin);
            done();
        });
    });

    it('Delete admin.', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteAdmin(id: "${admin}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.admin);
            done();
        });
    });

    let agent;
    it('Add agent', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addAgent(name:"agent1", email:"agent1@gmail.com", phone:"4444-4444-4444") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            agent = res.body.data.addAgent.id;
            // console.log(res.body.data);
            done();
        });
    });

    it('Return all agents.', (done) => {
        request.post('graphql')
        .send({ query: `{ agents { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Return a single agent.', (done) => {
        request.post('graphql')
        .send({ query: `{ agent(id: "${agent}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.agent);
            done();
        });
    });

    it('Delete agent.', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteAgent(id: "${agent}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.agent);
            done();
        });
    });

    let technician;
    it('Add technician', (done) => {
        request.post('graphql')
        .send({ query: `mutation {  addTechnician(name:"technician1", email:"technician1@gmail.com", phone:"5555-5555-5555") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            technician = res.body.data.addTechnician.id;
            // console.log(res.body.data);
            done();
        });
    });

    it('Return all technicians.', (done) => {
        request.post('graphql')
        .send({ query: `{ technicians { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Return a single technician.', (done) => {
        request.post('graphql')
        .send({ query: `{ technician(id: "${technician}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.technician);
            done();
        });
    });

    it('Delete technician.', (done) => {
        request.post('graphql')
        .send({ query: `mutation { deleteTechnician(id: "${technician}") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data.technician);
            done();
        });
    });


    let account;
    it('Add account', (done) => {

        request.post('graphql')
        .send({ query: `mutation {  addClient(name:"client1", email:"client1@gmail.com", phone:"2222-2222-2222") { id name email phone } }` })
        .expect(200)
        .end(async (err, res) => {
            if (err) return done(err);
            client = await res.body.data.addClient.id;
            // console.log(res.body.data.addClient.id);
        });

        request.post('graphql')
        .send({ query: `mutation {  addAgent(name:"agent1", email:"agent1@gmail.com", phone:"4444-4444-4444") { id name email phone } }` })
        .expect(200)
        .end(async (err, res) => {
            if (err) return done(err);
            agent = await res.body.data.addAgent.id;
        });
        
        request.post('graphql')
        .send({ query: `
            mutation {
                addAccount(account_no: "222-222-222", client_id: "${client}", location: "4000-4444-4000", agent_id: "${agent}") {
                    id
                    account_no
                    client {
                        id
                        name
                        email
                        phone
                    }
                    location
                    agent {
                        id
                        name
                        email
                        phone
                    }
                }
            }
        `})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            account = res.body.data.addAccount.id;
            // console.log(res.body.data);
            done();
        });
    });

    it('Return accounts.', (done) => {
        request.post('graphql')
        .send({ query: `
        {
            accounts {
                id
                account_no
                client {
                    id
                    name
                    email
                    phone
                }
                location
                agent {
                    id
                    name
                    email
                    phone
                }                    
            } 
        }
        `})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Return a single account.', (done) => {
        request.post('graphql')
        .send({ query: `
        { 
            account(id: "${account}") { 
                id
                account_no
                client {
                    id
                    name
                    email
                    phone
                }
                location
                agent {
                    id
                    name
                    email
                    phone
                }
            }
        }
        `})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Delete account.', (done) => {
        request.post('graphql')
        .send({ query: `
        mutation {
            deleteAccount(id: "${account}") { 
                id
                account_no
                client {
                    id
                    name
                    email
                    phone
                }
                location
                agent {
                    id
                    name
                    email
                    phone
                }
            }
        }
        ` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    let ticket;
    it('Add ticket', (done) => {

        request.post('graphql')
        .send({ query: `
            mutation {
                addAccount(account_no: "222-222-222", client_id: "${client}", location: "4000-4444-4000", agent_id: "${agent}") {
                    id
                    account_no
                    client {
                        id
                        name
                        email
                        phone
                    }
                    location
                    agent {
                        id
                        name
                        email
                        phone
                    }
                }
            }
        `})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            account = res.body.data.addAccount.id;
            // console.log(res.body.data);
        });

        request.post('graphql')
        .send({ query: `mutation {  addTechnician(name:"technician1", email:"technician1@gmail.com", phone:"5555-5555-5555") { id name email phone } }` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            technician = res.body.data.addTechnician.id;
            // console.log(res.body.data);
        });


        request.post('graphql')
        .send({ query: `
            mutation {
                addTicket(account_id:"${account}",category:install,client_available_date:"3399-9090-6309",client_available_time:"3399-9090-6309",note:"Hello world",technician_id:"${technician}") {
                    id
                    account {
                        id
                        account_no
                        client {
                            id
                            name
                            email
                            phone
                        }
                        location
                        agent {
                            id
                            name
                            email
                            phone
                        }
                    }
                    category
                    client_available_date
                    client_available_time
                    note
                    technician {
                        id
                        name
                        email
                        phone
                    }
                }
            }
        ` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            ticket = res.body.data.addTicket.id;
            // console.log(res.body.data);
            done();
        });
    });

    it('Return all tickets.', (done) => {
        request.post('graphql')
        .send({ query: `
        { 
            tickets { 
                account {
                    id
                    account_no
                    client {
                        id
                        name
                        email
                        phone
                    }
                    location
                    agent {
                        id
                        name
                        email
                        phone
                    }
                }
                category
                client_available_date
                client_available_time
                note
                technician {
                    id
                    name
                    email
                    phone
                }
            } 
        }
        ` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Return a single ticket.', (done) => {
        request.post('graphql')
        .send({ query: `
        { 
            ticket(id: "${ticket}") { 
                account {
                    id
                    account_no
                    client {
                        id
                        name
                        email
                        phone
                    }
                    location
                    agent {
                        id
                        name
                        email
                        phone
                    }
                }
                category
                client_available_date
                client_available_time
                note
                technician {
                    id
                    name
                    email
                    phone
                }
            }
        }
        ` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

    it('Delete ticket.', (done) => {
        request.post('graphql')
        .send({ query: `
        mutation { 
            deleteTicket(id: "${ticket}") { 
                account {
                    id
                    account_no
                    client {
                        id
                        name
                        email
                        phone
                    }
                    location
                    agent {
                        id
                        name
                        email
                        phone
                    }
                }
                category
                client_available_date
                client_available_time
                note
                technician {
                    id
                    name
                    email
                    phone
                }
            }
        }
        ` })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // console.log(res.body.data);
            done();
        });
    });

});