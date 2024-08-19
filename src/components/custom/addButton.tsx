import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip"
import { Button } from '~/components/ui/button'

interface AddButtonProps {
    children: React.ReactNode,
    tooltipText: string | React.ReactNode,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean
}

const AddButton = ({children, tooltipText, onClick, disabled}: AddButtonProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" disabled={disabled} onClick={onClick}>
                    {children}                    
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {tooltipText}
            </TooltipContent>
        </Tooltip>
    )
}

export default AddButton