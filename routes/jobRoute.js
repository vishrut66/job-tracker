import express from 'express'
import { createJob, getAllJob, deleteJob, updateJob, showStats } from "../controller/jobController.js"
import authenticateUser from '../middleware/auth.js'



const router = express.Router();

router.use(authenticateUser);

router.route('/').post(createJob).get(getAllJob);

// related " ID"
router.route('/stats').get(showStats);
router.route('/:id').patch(updateJob).delete(deleteJob);


export default router;