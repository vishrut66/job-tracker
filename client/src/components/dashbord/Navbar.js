import Wrapper from "../../assets/wrappers/Navbar";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useAppContext } from "../../Context/appContext";
import Logo from "../Logo";
import { useState } from "react";

const Navbar = () => {


    const [showLogout, setShowLogout] = useState(false)

    const { toggleSidebar, logoutUser, user } = useAppContext();

    return (
        <Wrapper>
            <div className="nav-center">
                <button
                    className="toggle-btn"
                    onClick={toggleSidebar}
                >
                    <FaAlignLeft />
                </button>

                <div>
                    <Logo />
                    <h3 className="logo-text">dashboard</h3>
                </div>

                <div className="btn-container">
                    <button className="btn" onClick={() => setShowLogout(!showLogout)}>
                        <FaUserCircle />
                        {user && user.name}
                        <FaCaretDown />
                    </button>
                    <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
                        <button
                            onClick={() => logoutUser()}
                            className="dropdown-btn"
                        >
                            logout
                        </button>
                    </div>
                </div>
            </div>
        </Wrapper >
    )
}

export default Navbar
