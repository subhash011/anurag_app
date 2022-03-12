import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./Home";
import TopBar from "./TopBar/TopBar";
import React, {useCallback, useEffect, useState} from "react";
import PrivateRoute from "./utils/PrivateRoute";
import Reward from "./User/Reward";

function App() {

    const [theme, setTheme] = useState('light');

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        const elementId = 'theme-link';
        const linkElement = document.getElementById('theme-link');
        const cloneLinkElement = linkElement.cloneNode(true);
        const newThemeUrl = linkElement.getAttribute('href').replace(theme, newTheme);
        cloneLinkElement.setAttribute('id', elementId + '-clone');
        cloneLinkElement.setAttribute('href', newThemeUrl);
        cloneLinkElement.addEventListener('load', () => {
            linkElement.remove();
            cloneLinkElement.setAttribute('id', elementId);
        });

        linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    }, [theme]);

    useEffect(() => {
        const localTheme = localStorage.getItem('theme');
        if (!localTheme) {
            localStorage.setItem('theme', theme);
        }
        if (localTheme !== theme) {
            toggleTheme();
        }
    }, [theme, toggleTheme]);

    return (
        <React.Fragment>
            <TopBar theme={theme} toggleTheme={toggleTheme} />
            <div className="h-4rem" />
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<Navigate to="/" />}/>
                <Route path="/reward" element={<PrivateRoute><Reward /></PrivateRoute>}/>
            </Routes>
        </React.Fragment>
    );
}

export default App;