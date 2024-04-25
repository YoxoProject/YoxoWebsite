import React from 'react';
import logo from './yoxo_logo.png';
import './App.css';

import {AlertCircle, LogOut} from "lucide-react"

import Main from "./components/page/Main";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./components/page/login/Login";
import {UserRound} from "lucide-react";
import Panel from "./components/page/panel/Panel";
import * as Request from "./utils/Request";
import NotificationUI from "./components/ui/notification/NotificationUI";
import ServerDashboard from "./components/page/dashboard/ServerDashboard";

function App() {

    const [token, setToken] = React.useState('');
    const [isLogged, setIsLogged] = React.useState(false);

    const logo_click = () => {
        window.location.href = "/";
        console.log("Logo clicked !");
    }

    const redirect = (path: string) => {
        window.location.href = path;
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        Request.logout().then(r => {
            setIsLogged(false)
            window.location.href = "/";
        });
    }

    React.useEffect(() => {
        if (token === '') {
            let token = localStorage.getItem('token');
            if (token !== null) {
                setToken(token);
            }
        }
        if (!isLogged) {
            if (token !== '') {
                Request.checkToken().then((status) => {
                    console.log("Token status: " + status);
                    setIsLogged(status);
                });
            }
        }
    }, [token, isLogged]);


    return (
        <div className="App">
            <header className="header ring-gray-50">
                <img src={logo} alt="Logo" id="logo" onClick={logo_click}/>
                <h1 onClick={logo_click}>Yoxo</h1>
                <menu>
                    <li className="menu_child" onClick={() => redirect("/panel")}>Panel</li>

                    {(isLogged ?
                            <LogOut className="menu_child user_icon" onClick={logout} /*size={30}*//>
                            :
                            <UserRound className="menu_child" id="user_icon" size={30}
                                       onClick={() => redirect("/login")}/>
                    )}
                </menu>
            </header>

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/login" element={<Login isLogged={isLogged}/>}/>
                    {(
                        isLogged ?
                            <Route path="/panel" element={<Panel token={token}/>}/>
                            :
                            <Route path="/panel"
                                   element={<NotificationUI message="Vous n'êtes pas connété" isVisible={true}
                                                            setIsVisible={(b) => {
                                                            }}/>}/>
                    )}
                    <Route path="/panel/:id" element={<ServerDashboard />} />
                </Routes>
            </BrowserRouter>

            <footer>
                <p>© 2024 Yoxo. Tous droits réservés.</p>
            </footer>
        </div>
    )
        ;

}

export default App;
