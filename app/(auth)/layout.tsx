import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div className=''>
        <div className=''>{children}</div>
    </div>
  )
}

export default layout