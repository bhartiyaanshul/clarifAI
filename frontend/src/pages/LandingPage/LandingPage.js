import React from 'react'
import './LandingPage.css'
import { ArrowIcon, LogoIcon } from '../../icons/icons'

const LandingPage = () => {
  return (
    <div className='landing-page'>
      <div className='landing-page-logo'>
        <LogoIcon />
        <div>Clarif.ai</div>
      </div>
      <div className='content'>
        <div>Revolutionising Content Moderation with AI
        </div>
        <a href = "/home" style = {{
          textDecoration: "none",
          color: "black"
        }}>
        <button className='explore-buttom'>Explore more<ArrowIcon /></button>
        </a>
      </div>
    </div>
  )
}

export default LandingPage