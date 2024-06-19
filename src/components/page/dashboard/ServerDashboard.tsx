import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getServer, startServer, Server, stopServer} from '../../../utils/Request';
import Console from "../../ui/console/Console";
import {useStore} from "../../../utils/Store";
import "./ServerDashboard.css";
import {Clock5, CloudDownload, CloudUpload, Cpu, HardDrive, MemoryStick, User, Wifi} from "lucide-react";

interface NetworkData {
    rx_bytes: number;
    tx_bytes: number;
}

interface StatsData {
    memory_bytes: number;
    memory_limit_bytes: number;
    cpu_absolute: number;
    network: NetworkData;
    state: string;
    disk_bytes: number;
}

function ServerDashboard() {
    let {id} = useParams<{ id: string }>();
    const [server, setServer] = useState<Server | null>(null);

    const addMessage = useStore(state => state.addMessage);
    const command_to_send_to_ws = useStore(state => state.command_to_send_to_ws);

    useEffect(() => {

        if (id === undefined) {
            return;
        }
        const fetchServerData = async () => {
            const serverData = await getServer(parseInt(id as string));
            setServer(serverData);
        };

        fetchServerData();
    }, [id]);


    // Websocket
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [stats, setStats] = useState<StatsData | null>(null);

    useEffect(() => {
        //const ws = new WebSocket(`ws://127.0.0.1:8888/server/${id}/ws`);
        const ws = new WebSocket(`wss://api.yoxo.software/server/${id}/ws`);

        ws.onopen = () => {
            console.log('WebSocket is connected');

            let token = localStorage.getItem('token') as string;

            ws.send(JSON.stringify({command: 'auth', data: token}));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            //console.log('Received message:', data);

            switch (data.command) {
                case 'status':
                    // handle status message
                    break;
                case 'console_output':
                    addMessage(data.data);
                    break;
                case 'stats':
                    const statsData = JSON.parse(data.data);
                    setStats(statsData);
                    break;
                case 'error':
                    // handle error message
                    break;
                case 'auth':
                    if (data.data === 'success') {
                        console.log('Authenticated');
                        ws.send(JSON.stringify({command: 'console_output', data: ''}));
                    }
                    break;
                default:
                    console.log('Received unknown message type:', data.type);
            }
        };

        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket is closed');
        };

        setWs(ws);

        return () => {
            ws.close();
        };
    }, [id, addMessage]);

    const sendCommand = (data: string) => {
        if (ws) {
            ws.send(JSON.stringify({command: 'send_command', data}));
        }
    };

    useEffect(() => {
        if (command_to_send_to_ws.length > 0) {
            const command = command_to_send_to_ws.shift() as string;
            sendCommand(command);
        }
    }, [command_to_send_to_ws, sendCommand]);

    const handleStartServer = async () => {
        let reponse = await startServer(parseInt(id as string));
        console.log(reponse.json());
    };

    const handleStopServer = async () => {
        let reponse = await stopServer(parseInt(id as string));
        console.log(reponse.json());
    }
    // End Websocket

    if (!server) {
        return <div>Loading...</div>;
    }


    return (
        <div className="dashboard">
            <div className="main_dashboard">
                <div className="dashboard_center">
                    <div className="dashboard_header">
                        <h1>{server.server_name}</h1>
                        <p>Description</p>
                    </div>

                    <div className="console">
                        <Console/>
                    </div>
                </div>

                <p></p>

                <div className="right_side">
                    <div className="action_button">
                        <button onClick={handleStartServer}>Start</button>
                        <button onClick={handleStopServer}>Stop</button>
                    </div>

                    <div className="server_details">
                        <div className="detail address">
                            <Wifi/>
                            <div className="data">
                                <p>Address</p>
                                <p>mc.yoxo.live</p>
                            </div>
                        </div>
                        <div className="detail uptime">
                            <Clock5/>
                            <div className="data">
                                <p>Uptime</p>
                                <p>1 day 2 hours 3 minutes</p>
                            </div>
                        </div>
                        <div className="detail cpu">
                            <Cpu/>
                            <div className="data">
                                <p>CPU</p>
                                <p>{stats ? stats.cpu_absolute + '%' : 'Loading'}</p>
                            </div>
                        </div>
                        <div className="detail memory">
                            <MemoryStick />
                            <div className="data">
                                <p>Memory</p>
                                <p>{stats ? formatBytes(stats.memory_bytes) + ' / ' + formatBytes(stats.memory_limit_bytes) : 'Loading...'}</p>
                            </div>
                        </div>
                        <div className="detail disk">
                            <HardDrive />
                            <div className="data">
                                <p>Disk</p>
                                <p>{stats ? formatBytes(stats.disk_bytes) : 'Loading...'}</p>
                            </div>
                        </div>
                        <div className="detail network_inboud">
                            <CloudDownload />
                            <div className="data">
                                <p>Network (Inbound)</p>
                                <p>{stats ? formatBytesPerSecond(stats.network.rx_bytes) : 'Loading...'}</p>
                            </div>
                        </div>
                        <div className="detail network_outbound">
                            <CloudUpload />
                            <div className="data">
                                <p>Network (Outbound)</p>
                                <p>{stats ? formatBytesPerSecond(stats.network.tx_bytes) : 'Loading...'}</p>
                            </div>
                        </div>
                        <div className="detail players">
                            <User />
                            <div className="data">
                                <p>Players</p>
                                <p>0/20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Display server details here */}
            {/* Include Start and Stop buttons */}
            {/* Display CPU, RAM, and network statistics */}
        </div>
    );
}

export default ServerDashboard;

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatBytesPerSecond(bytesPerSecond: number, decimals = 2) {
    if (bytesPerSecond === 0) return '0 Bytes/s';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'];

    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));

    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}