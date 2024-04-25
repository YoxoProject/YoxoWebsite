import {API_URL} from "./CONST";


export async function login(username: String, mdp: String): Promise<{ success: boolean, token: string, reason: string }> {
    return await postRequests('/auth/login', { username: username, mdp: mdp });
}

export async function checkToken() {
    let token = localStorage.getItem('token');

    if (token === undefined) {
        return false;
    }

    const response = await fetch(API_URL + '/auth/checkToken', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    });

    let statusCode = response.status;

    return statusCode === 200;

}

export async function logout() {
    let token = localStorage.getItem('token');

    if (token === undefined) {
        return false;
    }

    const response = await fetch(API_URL + '/auth/invalidateToken', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    });

    let statusCode = response.status;

    return statusCode === 200;
}

export async function getServers(): Promise<Array<{id: number, members: string[], params: string, server_name: string, is_running: boolean}>> {
    return await (await getRequests('/server/')).json();
}

export async function getServer(serverId: number): Promise<Server> {
    return await (await getRequests('/server/' + serverId)).json();
}

export async function startServer(serverId: number) {
    return await getRequests('/server/' + serverId + '/start');
}

export async function stopServer(serverId: number) {
    return await getRequests('/server/' + serverId + '/stop');
}

export async function getRequests(endpoint: String) {
    let token = localStorage.getItem('token');

    return await fetch(API_URL + endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    });
}

export async function postRequests(endpoint: String, body: any) {
    let token = localStorage.getItem('token');

    const response = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}


// Interface
export interface Server {
    id: number;
    server_name: string;
    members: Array<ServerMember>;
    params: string;
}

interface ServerMember {
    username: string;
}