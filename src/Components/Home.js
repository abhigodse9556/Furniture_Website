import React, { useRef } from 'react'
import Title from './Title';

export default function Home() {

    const containerRef = useRef(null);

    const open = () => {
        if (containerRef.current) {
            containerRef.current.classList.add('show-nav');
        }
    };

    const close = () => {
        if (containerRef.current) {
            containerRef.current.classList.remove('show-nav');
        }
    };

    return (
        <div>
            <main className="app-container" ref={containerRef}>
                <header className="circle-container">
                    <div className="circle">
                        <button id="close" onClick={close}>
                            <i className="fas fa-times"></i>
                        </button>
                        <button id="open" onClick={open}>
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </header>
                <section className="home-container">
                    <Title/>
                </section>
            </main>
            <nav>
                <ul>
                    <li><i className="fas fa-home"></i>मुख्यपृष्ठ</li>
                    <li><i className="fas fa-user-alt"></i>आमच्याविषयी</li>
                    <li><i className="fas fa-envelope"></i>संपर्क</li>
                </ul>
            </nav>
        </div>
    )
}
