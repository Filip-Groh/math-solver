import React from 'react'
import { Separator } from "~/components/ui/separator"

interface FractionProps {
    upHalf: React.ReactNode,
    downHalf:  React.ReactNode
}

const Fraction = ({upHalf, downHalf}: FractionProps) => {
    return (
        <div className='w-min'>
            <span className='flex flex-row justify-center px-1'>
                {upHalf}
            </span>
            <Separator />
            <span className='flex flex-row justify-center px-1'>
                {downHalf}
            </span>
        </div>
    )
}

export default Fraction