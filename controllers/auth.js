import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path, {dirname} from 'path';
import {fileURLToPath} from "url";
import {unlink} from "fs";
import Post from "../models/Post.js";

// Register user
export const register = async (req, res) => {
    try {
        const {username, password} = req.body;
        const isUsed = await User.findOne({username});

        if (isUsed) {
            return res.json({
                message: 'Данный username уже занят.'
            })
        }

        let filename;

        if (req.files.avatar.size) {
            filename = Date.now().toString() + req.files.avatar.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.avatar.mv(path.join(__dirname, '..', 'uploaded', filename));
        } else {
            filename = '';
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const isAdmin = password === process.env.ADMIN_PASSWORD;

        const newUser = new User({
            username,
            password: hash,
            avatar: filename,
            isAdmin,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        )

        await newUser.save();

        res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно'
        })
    } catch (error) {
        console.error(error)
        res.json({message: 'Ошибка при создании пользователя.'})
    }
}

//Login user 
export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({
                message: 'Неверный пароль.'
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        )

        res.json({
            token,
            user,
            message: 'Вы вошли в систему.'
        })
    } catch (error) {
        console.log('error: ', error)
        res.json({message: 'Ошибка при авторизации.'})
    }
}

//Get me 
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.'
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        console.log('error getMe: ', error)
        res.json({message: 'Нет доступа.'})
    }
}

// Update avatar
export const updateAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        let avatar;

        if (req.files.avatar.size) {
            if (user.avatar) {
                unlink(`uploaded/${user.avatar}`, (err) => {
                    if (err) {
                        throw new Error('Не удалось удалить старый аватар.')
                    }
                })
            }
            avatar = Date.now().toString() + req.files.avatar.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.avatar.mv(path.join(__dirname, '..', 'uploaded', avatar));
            user.avatar = avatar;
            await user.save();
        }

        const posts = await Post.find({userId: req.userId});

        await Promise.all(
            posts.map((post) => {
                post.avatar = avatar;
                post.save()
            })
        )

        res.json({message: 'Аватар успешно обновлен.', user})
    } catch (error) {
        console.error(error);
        res.json({message: error.message})
    }
}
