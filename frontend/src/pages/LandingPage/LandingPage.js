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
        <button>Explore more<ArrowIcon /></button>
      </div>
    </div>
  )
}

export default LandingPage