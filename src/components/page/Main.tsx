import React from 'react';
import './Main.css'; // Importez votre fichier CSS ici
import image_main_page from '../../terre_services_connecté.jpg';
import image_main_page_large from '../../terre_services_connecté_large.jpg';


const Main: React.FC = () => {
    return (
        <section className="main-content">
            <img src={image_main_page_large} alt="image_main_page" id="image_main_page"/>
            {/*<main className="home-content">
                <h1>Bienvenue sur Yoxo</h1>
                <h2>Votre partenaire de jeu pour NationsGlory</h2>
                <div className="wave"></div>
                <h2>Découvrez Yoxo</h2>
                <p>Services Gratuits pour une Expérience Améliorée</p>
                <p>Chez Yoxo, nous nous engageons à enrichir votre aventure sur NationsGlory. Profitez de nos services
                    gratuits
                    pour booster votre gameplay et gérer votre pays avec efficacité.</p>
                <div className="wave"></div>
                <h2>Nos Services</h2>
                <ul className="services">
                    <li>
                        <h3>Panel Personnalisé</h3>
                        <p>Créez facilement votre propre serveur privé NationsGlory avec notre panel intuitif</p>
                    </li>
                    <li>
                        <h3>Systèmes Innovants</h3>
                        <p>Bénéficiez de systèmes exclusifs conçus pour améliorer votre expérience de
                            jeu.</p>
                    </li>
                    <li>
                        <h3>Support Réactif</h3>
                        <p>Notre équipe est là pour vous aider à chaque étape de votre parcours sur
                            NationsGlory.</p>
                    </li>
                </ul>
                <div className="wave"></div>
                <h2>Nouveautés à Venir</h2>
                <p>Restez à l’affût ! De nouvelles fonctionnalités passionnantes seront bientôt disponibles pour rendre
                    votre
                    expérience sur NationsGlory encore plus épique.</p>
            </main>*/}
        </section>
    )
        ;
};

export default Main;