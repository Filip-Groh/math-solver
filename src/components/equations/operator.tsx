import React from 'react'
import { type OperatorType } from '~/lib/engine/equation'

interface OperatorProps {
    left: React.ReactNode,
    right: React.ReactNode,
    operator: OperatorType
}

const Operator = ({left, right, operator}: OperatorProps) => {
    return (
        <span className='flex flex-row gap-1 items-center'>
            {left}
            {operator}
            {right}
        </span>
    )
}

export default Operator