import React, {useEffect} from "react";
import Login from "./Auth/Login";
import {isAuthenticated} from "./Auth/auth.utils";
import Referral from "./User/Referral";
import Register from "./User/Register";
import {Toast} from "primereact/toast";

function Home() {

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isRegistered, setIsRegistered] = React.useState(false);
    const ref = React.useRef(null);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);

    return (
        <React.Fragment>
            <Toast ref={ref}/>
            <div className="flex flex-column mt-6">
                {!isLoggedIn && <Login onLoginSuccess={(isRegistered, toasts) => {
                    setIsLoggedIn(true)
                    ref.current.show(toasts);
                    setIsRegistered(isRegistered)
                }} />}
                {isLoggedIn && !isRegistered && <Register onRegistrationSuccess={(toasts) => {
                    ref.current.show(toasts);
                    setIsRegistered(true)
                }} />}
                {isLoggedIn && <Referral />}
            </div>
        </React.Fragment>
    );

}

export default Home;