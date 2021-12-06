import React from 'react'
import { Link } from 'gatsby'

import './index.scss'

export const Header = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  return (
    isRoot && (
      <h1 className="home-header">
        <Link to={`/`} className="link">
          <div className="new">new&nbsp;&nbsp;</div>
          <div className="class">DevLog</div>
          <div className="bracket">(</div>
          <div className="parameter">`{title}`</div>
          <div className="bracket">)</div>
        </Link>
      </h1>
    )
  )
}
