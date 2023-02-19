import express from "express";
import dotenv from 'dotenv';
import connectDB from "./db/connect.js";
import authRouter from "./routes/authRoute.js";
import jobRouter from "./routes/jobRoute.js";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";



// middlewares
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

dotenv.config({ path: './config.env' })

const app = express();


import 'express-async-errors';

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}
const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.json())
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));


// app.get('/', (req, res) => {
//     res.json({ msg: 'welcome from the server' })
// })

app.get('/api/v1', (req, res) => {
    res.json({ msg: 'welcome from the server' })
})


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobRouter)

// only when ready to deploy
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




const port = process.env.PORT || 5000;



const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        console.log('DB connection successful!')

        app.listen(port, () => {
            console.log(`server is listening on ${port}...`);
        })

    }
    catch (error) {
        console.log(error);
    }

}

start();