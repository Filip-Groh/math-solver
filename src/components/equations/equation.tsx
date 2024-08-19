import React from 'react'
import { type Node } from '~/lib/engine/equation'
import EquationsBuilder from './equationsBuilder'

interface Equation {
    tree: Node,
    mapKey: string,
    remove: (key: string) => void
}

const Equation = ({tree, mapKey, remove}: Equation) => {
    const handleDelete = () => {
        remove(mapKey)
    }

    return (
        <>
            <EquationsBuilder tree={tree} />
            <button onClick={handleDelete}>DELETE</button>
        </>
    )
}

export default Equation