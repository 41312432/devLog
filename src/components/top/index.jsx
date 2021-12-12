import React from 'react'
import { Link } from 'gatsby'

import { ThemeSwitch } from '../theme-switch'

import './index.scss'

export const Top = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  return (
    <div className="top">
      <Link to={`/`} className="link">
        {title}
      </Link>
      <ThemeSwitch />
    </div>
  )
}
