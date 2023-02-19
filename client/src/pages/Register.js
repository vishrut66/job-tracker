import React from "react";
import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from '../components/index';
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../Context/appContext";
import { useNavigate } from "react-router-dom";



const initialState = {
    name: "",
    email: "",
    password: "",
    isMember: true,
}

const Register = () => {

    const [values, setValues] = useState(initialState);
    const navigate = useNavigate();

    const { user, isLoading, showAlert, displayAlert, setupUser } = useAppContext();


    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: [e.target.value] })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        let { name, email, password, isMember } = values;
        if (!email || !password || (!isMember && !name)) {
            displayAlert();
            return
        }

        name = name[0];
        email = email[0];
        password = password[0]

        const currentUser = { name, email, password }

        if (isMember) {
            setupUser({ currentUser, endPoint: "login", alertText: "Login Successful!! redirecting..." })
        }
        else {
            setupUser({ currentUser, endPoint: "register", alertText: "User created! redirecting..." })
        }
    }

    useEffect(() => {

        if (user) {
            setTimeout(() => {
                navigate('/');
            }, 3000)
        }
    }, [user, navigate])

    return (
        <Wrapper className="full-page">
            <form action="" className="form" onSubmit={onSubmit}>
                <Logo />
                <h3>{values.isMember ? 'Login' : 'Register'}</h3>
                {showAlert && <Alert />}

                {/* name input */}
                {!values.isMember && (
                    <FormRow type='text' name='name' value={values.name} handleChange={handleChange} />
                )}


                {/* emial input */}
                <FormRow type='email' name='email' value={values.email} handleChange={handleChange} />

                {/* password input */}
                <FormRow type='password' name='password' value={values.password} handleChange={handleChange} />

                <button type="submit" className="btn btn-block" disabled={isLoading}>submit</button>

                <p>
                    {values.isMember ? 'Not a member yet' : 'already a member?'}
                    <button type="button" onClick={toggleMember} className="member-btn">
                        {values.isMember ? 'Register' : 'Login'}
                    </button>
                </p>

            </form>
        </Wrapper>
    )
}

export default Register;