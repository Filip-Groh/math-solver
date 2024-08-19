import React from 'react'

interface EqualParams {
    left: React.ReactNode,
    right: React.ReactNode,
    isCalculated: boolean
}

const Equal = ({left, right, isCalculated}: EqualParams) => {
    return (
        <span className='flex flex-row gap-1 items-center'>
            <span>{left}</span>
            =
            <span className={isCalculated ? "italic" : ""}>{right}</span>
        </span>
    )
}

export default Equal