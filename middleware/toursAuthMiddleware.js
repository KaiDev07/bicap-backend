import Token from "../models/tokenModel.js";

const toursAuthMiddleware = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return next();
        }

        const accessToken = authorization.split(" ")[1];
        if (!accessToken) {
            return next();
        }

        const userData = Token.validateAccessToken(accessToken);
        if (!userData) {
            return next();
        }

        req.user = userData;
        next();
    } catch (error) {
        next();
    }
};

export default toursAuthMiddleware;
