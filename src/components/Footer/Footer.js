import React from 'react'
import '../../App.css'
const Footer = () => {
    return (
        <div className="footer-styles" style={{ boxShadow:' 0 -7px 5px -5px  rgb(0 0 0 / 20%)',}}>
            <p>© {new Date().getFullYear()} Quick Trailer. All Rights Reserved</p>
        </div>
    )
}

export default Footer

