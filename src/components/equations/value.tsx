import React from 'react'

interface ValueProps {
    value: number
}

const Value = ({value}: ValueProps) => {
    return (
        <span>{value.toLocaleString()}</span>
    )
}

export default Value