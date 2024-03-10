/* eslint-disable react/prop-types */
import React from 'react'
import Sidebar from './sidebar'

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className='flex h-screen'>
        <div className='flex-none'><Sidebar className='shadow-lg'/></div>
        <div className='flex flex-col relative w-full overflow-y-auto bg-slate-100'>
          <main className='pb-16'>{children}</main>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Layout
