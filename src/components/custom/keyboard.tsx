import React from 'react'
import { Textarea } from "~/components/ui/textarea"

interface KeyboardProps {
    equation: string,
    setEquation: React.Dispatch<React.SetStateAction<string>>
}

const Keyboard = ({equation, setEquation}: KeyboardProps) => {
    return (
        <div>
            <Textarea placeholder='Input your equation' value={equation} onChange={(e) => {setEquation(e.target.value)}} />
        </div>
    )
}

export default Keyboard