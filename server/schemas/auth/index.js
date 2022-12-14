const { verify } = require("jsonwebtoken");

async function authenticateUser(models ,request) {
    if (request?.headers?.authorization) {
        const token = request.headers.authorization.split(" ")[1];
        const tokenPayload = verify(token, process.env.APP_SECRET);
        const userId = tokenPayload[Object.keys(tokenPayload)[0]];
        for (let i = 0,modelsLength = models.length; i < modelsLength; i++) {
            const model = models[i];
            const authenticatedUser = await model.findById(userId);
            if (authenticatedUser !== null) {
                const authenticateduserOnModel = model().constructor.modelName;
                return {
                    authenticatedUser,
                    authenticateduserOnModel,
                };
            }
        }
        // user is athenticated (User's token is not authorized for this request).
        return 2;
    }
    // user is not athenticated (User's token token is not available).
    return 1;
}

module.exports = authenticateUser;