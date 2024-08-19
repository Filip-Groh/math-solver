import React from 'react'

interface VariableProps {
    identifier: string,
    amount: number
}

const Variable = ({identifier, amount}: VariableProps) => {
    return (
        <span>{amount > 1 ? amount : null}{identifier}</span>
    )
}

export default Variable