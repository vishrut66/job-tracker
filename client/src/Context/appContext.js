import { React, useReducer, useContext, createContext } from "react";
import reducer from "./reducer";
import axios from "axios";

import { DISPLAY_ALERT, CLEAR_ALERT, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, HANDLE_CHANGE, CLEAR_VALUES, CREATE_JOB_BEGIN, CREATE_JOB_ERROR, CREATE_JOB_SUCCESS, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, SET_EDIT_JOB, DELETE_JOB_BEGIN, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, SHOW_STATS_BEGIN, SHOW_STATS_SUCCESS, CLEAR_FILTERS, CHANGE_PAGE } from "./actions";

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

const initialState = {

    // user details
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token || null,
    location: userLocation || '',
    showSidebar: false,

    // jobs detailes
    isEditing: false,
    editJobId: "",
    position: "",
    company: "",
    jobLocation: userLocation || '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: "full-time",
    statusOptions: ['interview', 'declined', 'pending'],
    status: "pending",
    // geting jobs for urrent user
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,

    // stats
    stats: {},
    monthlyApplications: [],

    // job search params
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const AppContext = createContext();

const AppProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    // jwt token set
    const authFetch = axios.create({
        baseURL: "/api/v1"
    });

    // request interceptor
    authFetch.interceptors.request.use(
        (config) => {
            config.headers["Authorization"] = `Bearer ${state.token}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // response interceptor
    authFetch.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            console.log(error.response);
            if (error.response.status === 401) {
                logoutUser();
            }
            return Promise.reject(error);
        }
    );

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, 3000)
    }

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('location', location);

    }
    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("user");
        localStorage.removeItem('location');

    }

    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {

            const res = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);
            // console.log(res);

            // store the responce 
            const { user, token, location } = res.data.userData;



            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: { user, token, location, alertText }
            })

            // add user tolocal storege
            addUserToLocalStorage({ user, token, location })

        }
        catch (err) {
            // console.log(err.response.data.msg);
            dispatch({
                type: SETUP_USER_ERROR,
                payload: {
                    msg: err.response.data.msg
                }
            })
        }

        clearAlert();
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const res = await authFetch.patch("/auth/updateUser", currentUser);
            // console.log(res);

            // store the responce 
            const { user, token, location } = res.data.userData;


            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: { user, token, location }
            })

            // add user tolocal storege
            addUserToLocalStorage({ user, token, location })

        } catch (err) {
            if (err.response.status !== 401) {
                console.log(err.response);
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: {
                        msg: err.response.data.msg
                    }
                })
            }
        }

        clearAlert();
    }

    const handleChange = ({ name, value }) => {
        dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {

            const { company, position, jobLocation, jobType, status } = state

            const res = await authFetch.post("/jobs", { company, position, jobLocation, jobType, status });


            dispatch({ type: CREATE_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })

            console.log(res);


        } catch (err) {
            if (err.response.status !== 401) {
                console.log(err.response);
                dispatch({
                    type: CREATE_JOB_ERROR,
                    payload: {
                        msg: err.response.data.msg
                    }
                })
            }
        }
        clearAlert();

    }

    const getJobs = async () => {

        const { page, search, searchStatus, searchType, sort } = state;
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

        if (search) {
            url = url + `&search=${search}`
        }

        dispatch({ type: GET_JOBS_BEGIN })
        try {

            const res = await authFetch.get(url);


            const { jobs, totalJobs, numOfPages } = res.data

            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages,
                },
            })

        } catch (error) {
            logoutUser()
        }
        clearAlert()
    }

    const setEditJob = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
        console.log(`set edit job : ${id}`)
    }

    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN });
        try {
            const { position, company, jobLocation, jobType, status } = state;

            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status,
            });

            dispatch({
                type: EDIT_JOB_SUCCESS,
            });

            dispatch({ type: CLEAR_VALUES });

        } catch (error) {
            if (error.response.status === 401) return;
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            });
        }
        clearAlert();
    }

    const deleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB_BEGIN });
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs();

        } catch (err) {
            logoutUser();
        }
    }

    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const res = await authFetch.get('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: res.data.defaultStats,
                    monthlyApplications: res.data.monthlyApplications,
                },
            })
        } catch (error) {
            logoutUser()
        }

        clearAlert()
    }

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })
    }

    const changePage = (page) => {

        dispatch({ type: CHANGE_PAGE, payload: { page } })
    }

    return (
        <AppContext.Provider value={{
            ...state, displayAlert, setupUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValues, createJob, getJobs, setEditJob, deleteJob, editJob, showStats, clearFilters, changePage
        }}>{children}</AppContext.Provider>
    )

}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }