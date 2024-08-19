import React from 'react'
import { type Node, ValueNode, OperatorNode, OperatorType, ParenthesesNode, EqualNode, VariableNode } from '~/lib/engine/equation'
import Value from './value'
import Fraction from './fraction'
import Operator from './operator'
import Parantheses from './parantheses'
import Equal from './equal'
import Variable from './variable'

interface EquationsBuilderProps {
    tree: Node
}

const EquationsBuilder = ({tree}: EquationsBuilderProps) => {
    if (tree instanceof ValueNode) {
        return <Value value={tree.value} />
    } else if (tree instanceof OperatorNode) {
        if (tree.operatorType === OperatorType.Divide) {
            const left = tree.left
            const right = tree.right
            const upHalf = left instanceof ParenthesesNode ? left.content : left
            const downHalf = right instanceof ParenthesesNode ? right.content : right
            return <Fraction upHalf={<EquationsBuilder tree={upHalf}/>} downHalf={<EquationsBuilder tree={downHalf}/>} />
        } else {
            return <Operator left={<EquationsBuilder tree={tree.left}/>} right={<EquationsBuilder tree={tree.right}/>} operator={tree.operatorType} />
        }
    } else if (tree instanceof ParenthesesNode) {
        return <Parantheses content={<EquationsBuilder tree={tree.content} />} />
    } else if (tree instanceof EqualNode) {
        return <Equal left={<EquationsBuilder tree={tree.left} />} right={<EquationsBuilder tree={tree.right} />} isCalculated={tree.isCalculated} />
    } else if (tree instanceof VariableNode) {
        return <Variable identifier={tree.identifier} amount={tree.amount}/>
    } else {
        console.log(tree)
        return <div>Unknown tree node!</div>
    }
}

export default EquationsBuilder