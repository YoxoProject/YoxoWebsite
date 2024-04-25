import {create} from "zustand";


interface Store {
    message: string[];
    addMessage: (message: string) => void;
    /*readMessage: () => { message: string };*/
    system_message: string[];
    addSystemMessage: (message: string) => void;

    command_to_send_to_ws: string[];
    addCommandToSendToWs: (command: string) => void;
}

export const useStore = create<Store>((set) => ({
    message: [''],
    addMessage: (message: string) => set((state: { message: string[]; }) => ({message: [...state.message, message]})),

    system_message: [''],
    addSystemMessage: (message: string) => set((state: { system_message: string[]; }) => ({system_message: [...state.system_message, message]})),

    command_to_send_to_ws: [''],
    addCommandToSendToWs: (command: string) => set((state: { command_to_send_to_ws: string[]; }) => ({command_to_send_to_ws: [...state.command_to_send_to_ws, command]})),
}));