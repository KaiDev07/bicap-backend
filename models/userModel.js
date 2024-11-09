import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { v4 } from "uuid";
import { sendActivationMail } from "../service/mailService.js";
import Token from "./tokenModel.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String,
    },
});

userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error("Все поля должны быть заполнены");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email не валидный");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Пароль ненадежный");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email уже используется");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const activationLink = v4();

    const user = await this.create({ email, password: hash, activationLink });

    await sendActivationMail(email, activationLink);

    return user;
};

userSchema.statics.activate = async function (activationLink) {
    const user = await this.findOne({ activationLink });
    if (!user) {
        throw Error("Недействительная активационная ссылка");
    }
    user.isActivated = true;
    await user.save();
};

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("Все поля должны быть заполнены");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Пользователь с таким Email не найден");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Неверный пароль");
    }

    return user;
};

userSchema.statics.refresh = async function (refreshToken) {
    if (!refreshToken) {
        throw Error("Пользователь не авторизован");
    }
    const userData = Token.validateRefreshToken(refreshToken);
    const tokenFromDb = await Token.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
        throw Error("Пользователь не авторизован");
    }

    const user = await this.findById(userData.id);

    return user;
};

userSchema.statics.getAllUsers = async function () {
    const users = await this.find();
    return users;
};

export default mongoose.model("User", userSchema);
