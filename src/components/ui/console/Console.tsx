import classNames from 'classnames';
import React, {KeyboardEvent as ReactKeyboardEvent} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import type {ITerminalInitOnlyOptions, ITerminalOptions, ITheme} from '@xterm/xterm';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from '@xterm/addon-fit';
import {SearchAddon} from '@xterm/addon-search';
import {WebLinksAddon} from '@xterm/addon-web-links';
import {theme as th} from 'twin.macro';

/*import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import useEventListener from '@/plugins/useEventListener';
import { usePermissions } from '@/plugins/usePermissions';
import { usePersistedState } from '@/plugins/usePersistedState';
import { ServerContext } from '@/state/server';*/

import '@xterm/xterm/css/xterm.css';
import styles from './style.module.css';
import {useStore} from "../../../utils/Store";

const theme: ITheme = {
    background: th`colors.black`.toString(),
    cursor: 'transparent',
    black: th`colors.black`.toString(),
    red: '#E54B4B',
    green: '#9ECE58',
    yellow: '#FAED70',
    blue: '#396FE2',
    magenta: '#BB80B3',
    cyan: '#2DDAFD',
    white: '#d0d0d0',
    brightBlack: 'rgba(255, 255, 255, 0.2)',
    brightRed: '#FF5370',
    brightGreen: '#C3E88D',
    brightYellow: '#FFCB6B',
    brightBlue: '#82AAFF',
    brightMagenta: '#C792EA',
    brightCyan: '#89DDFF',
    brightWhite: '#ffffff',
    selectionBackground: '#FAF089',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    fontFamily: th('fontFamily.mono'),
    theme: theme,
    allowProposedApi: true,
};

const terminalInitOnlyProps: ITerminalInitOnlyOptions = {
    rows: 40,
};

export default () => {
    const TERMINAL_PRELUDE = '\u001b[1m\u001b[33mYoxo@deamon~ \u001b[0m';
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({...terminalProps, ...terminalInitOnlyProps}), []);
    const [inputValue, setInputValue] = useState('');

    const add_command_to_send_to_ws = useStore(state => state.addCommandToSendToWs);
    // Function to handle 'Enter' key press
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            console.log('handleKeyDown', inputValue);

            add_command_to_send_to_ws(inputValue);
            // Send inputValue to WebSocket here
            // For example:
            // websocket.send(inputValue);
            // Clear the input field
            setInputValue('');
        }
    };

    const handleConsoleOutput = (line: string, prelude = false) => {

        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m');
    }


    // Custom test
    const message = useStore(state => state.message);
    const system_message = useStore(state => state.system_message);

    useEffect(() => {
        if (message.length > 0) {
            const newMessage = message.shift() as string;
            handleConsoleOutput(newMessage, false);
        }
        if (system_message.length > 0) {
            const newMessage = system_message.shift() as string;
            handleConsoleOutput(newMessage, true);
        }
    }, [handleConsoleOutput, message, system_message]);

    const handlePowerChangeEvent = (state: string) =>
        terminal.writeln(TERMINAL_PRELUDE + 'Server marked as ' + state + '...\u001b[0m');

    useEffect(() => {
        if (ref.current && !terminal.element) {
            terminal.open(ref.current);
            handleConsoleOutput("Welcome to the console!", true);
        }
    }, [handleConsoleOutput, terminal]);


    return (
            <div className={classNames(styles.terminal, 'relative')}>
                <div
                    className={classNames(styles.container, styles.overflows_container, {'rounded-b': false})}
                >
                    <div className={'h-full'}>
                        <div id={styles.terminal} ref={ref}/>
                    </div>
                </div>
                <div className={classNames('relative', styles.overflows_container)}>
                    <input
                        className={classNames('peer', styles.command_input)}
                        type={'text'}
                        placeholder={'Type a command...'}
                        aria-label={'Console command input.'}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div
                        className={classNames(
                            'text-slate-100 peer-focus:animate-pulse peer-focus:text-slate-50',
                            styles.command_icon,
                        )}
                    >
                    </div>
                </div>
            </div>
    );
};