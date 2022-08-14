const { verify } = require("jsonwebtoken");

async function authenticateClient(model ,request) {
    if (request?.headers?.authorization) {
        const token = request.headers.authorization.split(" ")[1];
        const tokenPayload = verify(token, process.env.APP_SECRET);
        const userId = tokenPayload[Object.keys(tokenPayload)[0]];
        return await model.findById(userId);
    }
    return null;
}

module.exports = authenticateClient;