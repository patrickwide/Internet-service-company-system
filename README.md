# Ticketing application

## Database 
- A password will have to be created the first time the app launches that will be used to join admins

### Clients
- Client can post a ticket
``` json
// Name
// Email
// Phone
// Account
// Location
// Creator
```
### Admins
- Admin Read everything going on in the system 
- Can add/Remove a Technician
- Can add/Remove an Agent

``` json
// Name
// Email
// Phone
```
### Agents 
- Agent can add clients
- Can post a ticket on behalf of the client
``` json
// Name
// Email
// Phone
```
### Technicians
- Technicians can take a ticket 
- Can only take a ticket if he/she does't have a ticket
``` json
// Name
// Email
// Phone
// Slot
```
### Tickets
``` json
// Account
// Status
// Note - ( enum: [ 'Not Taken','Taken', 'Done' ] )
```
