import User from "../models/User.js";

export const checkAdmin = async (req, res, next) => {
    try {
        if (req.userId) {
            try {
                const user = await User.findById(req.userId);
                if (user) {
                    if (user.isAdmin) {
                        next();
                    } else {
                        throw new Error('Пользователь не является админом.');
                    }
                } else {
                    throw new Error('Пользователь не найден.')
                }
            } catch (error) {
                console.error(error);
                return res.json({message: error.message})
            }
        } else {
            return res.json({message: 'Пользователь не идентифицирован.'})
        }
    } catch (error) {
        console.error(error);
        return res.json({message: error.message});
    }

}