import React from "react";
import main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import { Logo } from "../components/index";
import { Link } from "react-router-dom";


const Landing = () => {

    return (
        <Wrapper>
            <nav>
                <Logo />
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>
                        Job <span>tracking</span> app
                    </h1>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis sit dolores repudiandae illo omnis optio eligendi dolorem sunt non necessitatibus.
                    </p>
                    <Link to="/register">
                        <button className="btn btn-hero">Login/Register</button>
                    </Link>
                </div>
                <img src={main} alt="job hunt" className="img main-img" />
            </div>
        </Wrapper>
    )
}



export default Landing;