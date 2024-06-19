import React, {useState} from "react";
import * as Request from "../../../utils/Request";
import "./Panel.css";
import {HardDrive} from "lucide-react";
import NotificationUI from "../../ui/notification/NotificationUI";

function ServersList() {

    const voidServer = {
        id: -1, members: [''], params: '', server_name: '', is_running: false
    }

    const [servers, setServers] = React.useState([voidServer]);

    React.useEffect(() => {
        Request.getServers().then((data) => {
            console.log(data);
            setServers(data);
        });
    }, []);

    const selectServer = (serverId: number) => {
        window.location.href = `/YoxoWebsite/#/panel/${serverId}`;
    }

    /*return (
        <div className="servers">
            {servers.map((server) => {
                return (
                    <div className="server" key={server.id} onClick={() => selectServer(server.id)}>
                        <HardDrive />
                        <h1>{server.server_name}</h1>
                        <p>Description</p>
                        <p>RUNNING/NOT RUNNING</p>
                    </div>
                )
            })}
        </div>
    )*/

    return (
        <div className="servers">
            {servers.map((server) => {
                return (
                    <div className="server" key={server.id} onClick={() => selectServer(server.id)}>
                        <HardDrive className="icon" strokeWidth="1.5px"/>
                        <div className="content">
                            <h1>{server.server_name}</h1>
                            <p>Description</p>
                        </div>
                        <div className={`status ${(server.is_running) ? '' : 'status-not-running'}`}></div>
                    </div>
                )
            })}
        </div>
    )

}

function Panel({token}: { token: string }) {

    const [notificationMessage, setNotificationMessage] = useState('');
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);

    const showNotification = (message: string) => {
        setNotificationMessage(message);
        setIsNotificationVisible(true);
    };


    return (
        <div className="panel">
            <NotificationUI
                message={notificationMessage}
                isVisible={isNotificationVisible}
                setIsVisible={setIsNotificationVisible}
            />
            <ServersList/>

        </div>
    )
}

export default Panel;