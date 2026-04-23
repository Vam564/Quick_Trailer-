import React from 'react'
import '../../App.css'

const Footer = () => {
    return (
        <footer className="footer-styles">
            <p className="footer-copy">© {new Date().getFullYear()} Quick Trailer. All Rights Reserved.</p>
            <p className="footer-tagline">Discover trailers &amp; stream movies instantly.</p>
        </footer>
    )
}

export default Footer

