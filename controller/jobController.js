import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Job from "../models/JobModel.js"
import mongoose from "mongoose";
import checkPermission from "../utils/checkPermission.js";
import moment from "moment";


const getAllJob = catchAsync(async (req, res) => {

    const { search, status, jobType, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId,
    };

    if (status && status !== "all") {
        queryObject.status = status;
    }

    if (jobType && jobType !== "all") {
        queryObject.jobType = jobType
    }

    if (search) {
        queryObject.position = { $regex: search, $options: "i" };
    }


    // NO AWAIT
    let result = Job.find(queryObject);

    // chain sort conditions
    if (sort === "latest") {
        result = result.sort("-createdAt");
    }
    if (sort === "oldest") {
        result = result.sort("createdAt");
    }
    if (sort === "a-z") {
        result = result.sort("position");
    }
    if (sort === "z-a") {
        result = result.sort("-position");
    }

    // setup pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    // chain sort conditions

    const jobs = await result;

    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);


    res.status(200).json({
        status: 'success',
        totalJobs,
        numOfPages,
        jobs
    })



})


const createJob = catchAsync(async (req, res, next) => {
    const { company, position } = req.body;

    if (!company || !position) {
        return next(new AppError("Please provide all values", 400))
    }

    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body);

    res.status(201).json({
        status: "success",
        job
    })


})


const updateJob = catchAsync(async (req, res, next) => {

    const jobId = req.params.id;

    const { company, position } = req.body;

    if (!company || !position) {
        return next(new AppError("Please provide all values", 400))
    }

    const job = await Job.findOne({ _id: jobId });

    if (!job) {
        return next(new AppError(`No job found`, 404))
    }

    const isOk = checkPermission(req.user, job.createdBy)

    if (!isOk) {
        return next(new AppError("you do not have permission to edit this job", 401))
    }

    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        status: 'success',
        updatedJob
    })
})


const deleteJob = catchAsync(async (req, res, next) => {

    const jobId = req.params.id;

    const job = await Job.findOne({ _id: jobId });

    if (!job) {
        return next(new AppError(`No job found`, 404))
    }

    const isOk = checkPermission(req.user, job.createdBy)

    if (!isOk) {
        return next(new AppError("you do not have permission to edit this job", 401))
    }

    await Job.findOneAndDelete({ _id: jobId });

    res.status(200).json({
        status: 'seccess'
    })
})


const showStats = catchAsync(async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {});

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    };

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt",
                    },
                    month: {
                        $month: "$createdAt",
                    },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
        .map((item) => {
            const { _id: { year, month }, count } = item;
            // accepts 0-11
            const date = moment()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count };
        })
        .reverse();


    res.status(200).json({
        status: "success",
        defaultStats,
        monthlyApplications
    });
})


export { createJob, getAllJob, deleteJob, updateJob, showStats }