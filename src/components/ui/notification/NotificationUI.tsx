import React, {useEffect} from 'react';
import './NotificationUI.css';
import {CircleX} from "lucide-react";

interface NotificationProps {
    message: string;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

const NotificationUI: React.FC<NotificationProps> = ({message, isVisible, setIsVisible}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, setIsVisible]);

    if (!isVisible) return null;

    return (
        <div className="notification">
            <div className="message">
                <CircleX color="red" size="40px"/>
                <div className="text">
                    <p className="errorTitle">Oops ! Il y a eu une erreur</p>
                    <p className="errorMessage">{message}</p>
                </div>

            </div>
            <div className="progressBarContainer">
                <div className="progressBar"></div>
            </div>
        </div>
    );
}

export default NotificationUI;