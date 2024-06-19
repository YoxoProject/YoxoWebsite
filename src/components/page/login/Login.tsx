//import './AccountConnect.css';
import React, {useState} from "react";
import * as Request from "../../../utils/Request";
import "./Login.css";
import {KeyRound, Mail} from "lucide-react";
import NotificationUI from "../../ui/notification/NotificationUI";

function Login({isLogged}: {isLogged: boolean}) {

    const [username, setUsername] = useState('');
    const [mdp, setMdp] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);

    const showNotification = (message: string) => {
        setNotificationMessage(message);
        setIsNotificationVisible(true);
    };
    const handleLogin = async () => {
        let data = await Request.login(username, mdp);

        if (data.success) {
            console.log("Login success !")
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            window.location.href = "/YoxoWebsite/#/panel";
        } else {
            showNotification(data.reason);
            console.log("Login failed !")
        }
        console.log(data); // Debug !!
    };

    React.useEffect(() => {
        if (isLogged) {
            window.location.href = "/YoxoWebsite/#/panel";
        }
    })

    return (
        <div>
            <NotificationUI
                message={notificationMessage}
                isVisible={isNotificationVisible}
                setIsVisible={setIsNotificationVisible}
            />
            <div className="login">


                <h1>Bienvenue sur la page de Connexion</h1>
                <p>Afin de vous connecter, merci de rentrer votre pseudo et votre mot de passe. <br/> Si vous n'avez pas
                    de compte, contacté ... afin d'en obtenir un</p>

                <div className="field">
                    <Mail/>
                    <input type="text" placeholder="Votre nom d'utilisateur"
                           onChange={event => setUsername(event.target.value)}/>
                </div>
                <div className="field">
                    <KeyRound/>
                    <input type="password" placeholder="Votre mot de passe"
                           onChange={event => setMdp(event.target.value)}/>
                </div>

                <button className="button" type="submit" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;