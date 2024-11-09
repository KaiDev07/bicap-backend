import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import { createTokens } from "../service/createTokens.js";

export const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.signup(email, password);

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
        };
        const tokens = createTokens(tokenPayload);

        await Token.savetoken(user._id, tokens.refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(200).json({ ...tokens, user: tokenPayload });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        await User.activate(activationLink);
        res.redirect(process.env.CLIENT_URL);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.login(email, password);

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
        };
        const tokens = createTokens(tokenPayload);

        await Token.savetoken(user._id, tokens.refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(200).json({ ...tokens, user: tokenPayload });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await Token.removeToken(refreshToken);
        res.clearCookie("refreshToken");
        res.json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        const user = await User.refresh(refreshToken);

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
        };
        const tokens = createTokens(tokenPayload);

        await Token.savetoken(user._id, tokens.refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(200).json({ ...tokens, user: tokenPayload });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
