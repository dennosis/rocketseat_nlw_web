import React from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import {FiLogIn} from 'react-icons/fi';
import {Link} from 'react-router-dom'

const Home = ()=> {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>
                 <main>
                    <h1>Seu marketplace de coleta de residuos</h1>
                    <p>ajudando as pessoas nas coletas de residuos</p>
                    <Link to="/cadastro">
                        <span>
                            <FiLogIn/> 
                        </span>
                        <strong>Cadstre um ponto de coleta</strong>
                    </Link>
                 
                 </main>
            </div>

        </div>
    );
}

export default Home;