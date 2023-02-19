import User from "../models/UserModel.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";


const register = catchAsync(async (req, res, next) => {


    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("Please provide all vlaues!", 400))
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
        return next(new AppError("Already have account with this email", 400))
    }

    const newUser = await User.create({ name, email, password });

    // creating jwt token
    const token = newUser.createJWT();

    // Remove password from output
    newUser.password = undefined;
    res.status(201).json({
        status: "success",
        userData: {
            user: newUser,
            token,
            location: newUser.location
        }

    })

    // or i can do this also
    // res.status(201).json({
    //     status: "success",
    //     data: {
    //         user: {
    //             email:newUser.email,
    //             lastName: newUser.lastName,
    //             location:newUser.location,
    //             name: newUser.name,
    //         },
    //         jwt: token
    //     }
    // })

})

const login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide all values!", 400))
    }

    const user = await User.findOne({ email }).select('+password')

    // console.log(user);

    if (!user) {
        return next(new AppError("Invalide Creadentials! (user does not exist)", 401))
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return next(new AppError('Invalide Creadentials!!', 401))
    }

    // creating jwt token
    const token = user.createJWT();

    // Remove password from output
    user.password = undefined;
    res.status(200).json({
        status: "success",
        userData: {
            user,
            token,
            location: user.location
        }
    })
})

const updateUser = catchAsync(async (req, res, next) => {

    const { email, name, lastName, location } = req.body;

    if (!email || !name || !lastName || !location) {
        return next(new AppError("Please provide all values!", 400));
    }

    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;


    await user.save();

    const token = user.createJWT();

    res.status(200).json({
        status: "success",
        userData: {
            user,
            token,
            location: user.location
        }
    })
})


export { register, login, updateUser }