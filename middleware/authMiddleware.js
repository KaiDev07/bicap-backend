import Token from "../models/tokenModel.js";

const authMiddleware = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "Запрос не авторизован" });
        }

        const accessToken = authorization.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({ error: "Запрос не авторизован" });
        }

        const userData = Token.validateAccessToken(accessToken);
        if (!userData) {
            return res.status(401).json({ error: "Запрос не авторизован" });
        }

        req.user = userData;
        next();
    } catch (error) {
        res.status(401).json({ error: "Запрос не авторизован" });
    }
};

export default authMiddleware;
