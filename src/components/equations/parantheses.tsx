"use client"

import React from 'react'

interface ParanthesesProps {
    content: React.ReactNode
}

const Parantheses = ({content}: ParanthesesProps) => {
    return (
        <span className='flex flex-row gap-1 items-center'>
            (
            {content}
            )
        </span>
    )
}

export default Parantheses