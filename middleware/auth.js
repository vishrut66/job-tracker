import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

const auth = catchAsync(async (req, res, next) => {

    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(new AppError("Authorization  Invalide", 401))
    }

    // get the token 
    const token = authHeader.split(" ")[1];


    // verify the token os from logged in user?
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
        return next(new AppError("Authorization  Invalide", 401))
    }

    req.user = { userId: payload.userId };

    // 3) Check if user still exists
    // const currentUser = await User.findById(payload.userId);
    // if (!currentUser) {
    //     return next(
    //         new AppError(
    //             'The user belonging to this token does no longer exist.',
    //             401
    //         )
    //     );
    // }
    // req.user = currentUser;

    next();
})

export default auth