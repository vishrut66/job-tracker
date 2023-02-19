import { DISPLAY_ALERT, CLEAR_ALERT, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, HANDLE_CHANGE, CLEAR_VALUES, CREATE_JOB_BEGIN, CREATE_JOB_ERROR, CREATE_JOB_SUCCESS, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, SET_EDIT_JOB, DELETE_JOB_BEGIN, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, SHOW_STATS_BEGIN, SHOW_STATS_SUCCESS, CLEAR_FILTERS, CHANGE_PAGE } from "./actions";
import { initialState } from "./appContext";


const reducer = (state, action) => {

    if (action.type === DISPLAY_ALERT) {
        return {
            ...state,
            showAlert: true,
            alertType: 'danger',
            alertText: 'Please provide all values',
        }
    }

    if (action.type === CLEAR_ALERT) {
        return {
            ...state,
            showAlert: false,
            alertType: '',
            alertText: '',
        }
    }

    // register and loggin the user

    if (action.type === SETUP_USER_BEGIN) {
        return { ...state, isLoading: true }
    }

    if (action.type === SETUP_USER_SUCCESS) {

        return {
            ...state,
            isLoading: false,
            token: action.payload.token,
            user: action.payload.user,
            location: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: action.payload.alertText
        }
    }

    if (action.type === SETUP_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }


    if (action.type === TOGGLE_SIDEBAR) {
        return { ...state, showSidebar: !state.showSidebar };
    }

    // logout user

    if (action.type === LOGOUT_USER) {
        return {
            ...initialState,
            user: null,
            token: null,
            userLocation: "",
            jobLocation: "",
        };
    }


    // updating user

    if (action.type === UPDATE_USER_BEGIN) {
        return { ...state, isLoading: true }
    }

    if (action.type === UPDATE_USER_SUCCESS) {

        return {
            ...state,
            isLoading: false,
            token: action.payload.token,
            user: action.payload.user,
            location: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: "updated successfully"
        }
    }


    if (action.type === UPDATE_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: "something went wrong"
        }
    }
    if (action.type === HANDLE_CHANGE) {
        return {
            ...state,
            page: 1,
            [action.payload.name]: action.payload.value
        }
    }

    if (action.type === CLEAR_VALUES) {
        const initialState = {
            isEditing: false,
            editJobId: " ",
            position: " ",
            company: " ",
            jobLocation: state.userLocation,
            jobType: "full-time",
            status: "pending",
        };
        return { ...state, ...initialState };
    }

    // creating job 

    if (action.type === CREATE_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }


    if (action.type === CREATE_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: "New Job Created!!"
        }
    }


    if (action.type === CREATE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }

    // getting all the jobs

    if (action.type === GET_JOBS_BEGIN) {
        return { ...state, isLoading: true, showAlert: false };
    }

    if (action.type === GET_JOBS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            jobs: action.payload.jobs,
            totalJobs: action.payload.totalJobs,
            numOfPages: action.payload.numOfPages,
        };
    }

    //start for edit job

    if (action.type === SET_EDIT_JOB) {
        const job = state.jobs.find((job) => job._id === action.payload.id);
        const { _id, position, company, jobLocation, jobType, status } = job;

        return {
            ...state,
            isEditing: true,
            editJobId: _id,
            position,
            company,
            jobLocation,
            jobType,
            status,
        };
    }

    if (action.type === EDIT_JOB_BEGIN) {
        return { ...state, isLoading: true };
    }
    if (action.type === EDIT_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: "success",
            alertText: "Job Updated!",
        };
    }
    if (action.type === EDIT_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: "danger",
            alertText: action.payload.msg,
        };
    }


    // delete job 

    if (action.type === DELETE_JOB_BEGIN) {
        return { ...state, isLoading: true };
    }


    // show stats

    if (action.type === SHOW_STATS_BEGIN) {
        return { ...state, isLoading: true, showAlert: false };
    }

    if (action.type === SHOW_STATS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            stats: action.payload.stats,
            monthlyApplications: action.payload.monthlyApplications,
        };
    }

    // cleaar sats
    if (action.type === CLEAR_FILTERS) {
        return {
            ...state,
            search: "",
            searchStatus: "all",
            searchType: "all",
            sort: "latest",
        };
    }

    // pagination
    if (action.type === CHANGE_PAGE) {

        return { ...state, page: action.payload.page };
    }

    throw new Error(`no such action : ${action.type}`)
}

export default reducer;