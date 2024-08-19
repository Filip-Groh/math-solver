export enum OperatorType {
    Plus = "+",
    Minus = "-",
    Multiply = "*",
    Divide = "/"
}

export abstract class Node {
    abstract to_string(): string
    abstract collabse(): Node
    abstract copy(): Node
}

export class ValueNode extends Node {
    value = 0
    
    constructor(value: number) {
        super()
        this.value = value
    }

    to_string(): string {
        return this.value.toLocaleString()
    }

    collabse(): Node {
        return this
    }

    copy(): Node {
        return new ValueNode(this.value)
    }
}

// Euclidean algorithm
function greatestCommonDivisor(a: number, b: number) {
    while (b !== 0) {
        const t = b
        b = a % b
        a = t
    }
    return a
}

export class OperatorNode extends Node {
    left: Node
    right: Node
    operatorType: OperatorType

    constructor(left: Node, right: Node, operatorType: OperatorType) {
        super()
        this.left = left
        this.right = right
        this.operatorType = operatorType
    }

    to_string(): string {
        return `(${this.left.to_string()} ${this.operatorType} ${this.left.to_string()})`
    }

    collabse(): Node {
        let collabsedLeft = this.left.collabse()
        let collabsedRight = this.right.collabse()
        switch(this.operatorType) {
            case OperatorType.Plus:
                if (collabsedLeft instanceof ValueNode && collabsedRight instanceof ValueNode) {
                    collabsedLeft.value += collabsedRight.value
                    return collabsedLeft
                }

                if (collabsedRight instanceof OperatorNode && collabsedRight.operatorType === OperatorType.Divide) {
                    const expanded = new OperatorNode(collabsedLeft, collabsedRight.right, OperatorType.Multiply)
                    const added = new OperatorNode(collabsedRight.left, expanded, OperatorType.Plus)
                    collabsedRight.left = added.collabse()
                    return collabsedRight
                }
                if (collabsedLeft instanceof OperatorNode && collabsedLeft.operatorType === OperatorType.Divide) {
                    const expanded = new OperatorNode(collabsedRight, collabsedLeft.right, OperatorType.Multiply)
                    const added = new OperatorNode(collabsedLeft.left, expanded, OperatorType.Plus)
                    collabsedLeft.left = added.collabse()
                    return collabsedLeft
                }

                if (collabsedLeft instanceof VariableNode && collabsedRight instanceof VariableNode && collabsedLeft.identifier === collabsedRight.identifier) {
                    collabsedLeft.amount += collabsedRight.amount
                    return collabsedLeft
                }

                if (collabsedLeft instanceof VariableNode && collabsedRight instanceof ValueNode) {
                    const gcd = greatestCommonDivisor(collabsedLeft.amount, collabsedRight.value)
                    if (gcd !== 1) {
                        collabsedLeft.amount /= gcd
                        collabsedRight.value /= gcd
                        return new OperatorNode(new ValueNode(gcd), new ParenthesesNode(new OperatorNode(collabsedLeft, collabsedRight, OperatorType.Plus)), OperatorType.Multiply)
                    }
                }
                if (collabsedLeft instanceof ValueNode && collabsedRight instanceof VariableNode) {
                    const gcd = greatestCommonDivisor(collabsedRight.amount, collabsedLeft.value)
                    if (gcd !== 1) {
                        collabsedRight.amount /= gcd
                        collabsedLeft.value /= gcd
                        return new OperatorNode(new ValueNode(gcd), new ParenthesesNode(new OperatorNode(collabsedRight, collabsedLeft, OperatorType.Plus)), OperatorType.Multiply)
                    }
                }
                if (collabsedLeft instanceof VariableNode && collabsedRight instanceof VariableNode) {
                    const gcd = greatestCommonDivisor(collabsedRight.amount, collabsedLeft.amount)
                    if (gcd !== 1) {
                        collabsedRight.amount /= gcd
                        collabsedLeft.amount /= gcd
                        return new OperatorNode(new ValueNode(gcd), new ParenthesesNode(new OperatorNode(collabsedRight, collabsedLeft, OperatorType.Plus)), OperatorType.Multiply)
                    }
                }
                break
            case OperatorType.Minus:
                if (collabsedLeft instanceof ValueNode && collabsedRight instanceof ValueNode) {
                    collabsedLeft.value -= collabsedRight.value
                    return collabsedLeft
                }

                if (collabsedRight instanceof OperatorNode && collabsedRight.operatorType === OperatorType.Divide) {
                    const expanded = new OperatorNode(collabsedLeft, collabsedRight.right, OperatorType.Multiply)
                    const added = new OperatorNode(expanded, collabsedRight.left, OperatorType.Minus)
                    collabsedRight.left = added.collabse()
                    return collabsedRight
                }
                if (collabsedLeft instanceof OperatorNode && collabsedLeft.operatorType === OperatorType.Divide) {
                    const expanded = new OperatorNode(collabsedRight, collabsedLeft.right, OperatorType.Multiply)
                    const added = new OperatorNode(collabsedLeft.left, expanded, OperatorType.Minus)
                    collabsedLeft.left = added.collabse()
                    return collabsedLeft
                }

                if (collabsedLeft instanceof VariableNode && collabsedRight instanceof VariableNode && collabsedLeft.identifier === collabsedRight.identifier) {
                    collabsedLeft.amount -= collabsedRight.amount
                    return collabsedLeft
                }
                break
            case OperatorType.Multiply:
                if (collabsedLeft instanceof ValueNode && collabsedRight instanceof ValueNode) {
                    collabsedLeft.value *= collabsedRight.value
                    return collabsedLeft
                }

                if (collabsedRight instanceof OperatorNode && collabsedRight.operatorType === OperatorType.Divide) {
                    if (!(collabsedLeft instanceof OperatorNode) || collabsedLeft.operatorType !== OperatorType.Divide) {
                        collabsedLeft = new OperatorNode(collabsedLeft, new ValueNode(1), OperatorType.Divide)
                    }
                    collabsedRight.left = new OperatorNode((collabsedLeft as OperatorNode).left, collabsedRight.left, OperatorType.Multiply)
                    collabsedRight.right = new OperatorNode((collabsedLeft as OperatorNode).right, collabsedRight.right, OperatorType.Multiply)
                    return collabsedRight.collabse()
                }
                if (collabsedLeft instanceof OperatorNode && collabsedLeft.operatorType === OperatorType.Divide) {
                    if (!(collabsedRight instanceof OperatorNode) || collabsedRight.operatorType !== OperatorType.Divide) {
                        collabsedRight = new OperatorNode(collabsedRight, new ValueNode(1), OperatorType.Divide)
                    }
                    collabsedLeft.left = new OperatorNode((collabsedRight as OperatorNode).left, collabsedLeft.left, OperatorType.Multiply)
                    collabsedLeft.right = new OperatorNode((collabsedRight as OperatorNode).right, collabsedLeft.right, OperatorType.Multiply)
                    return collabsedLeft.collabse()
                }

                if (collabsedLeft instanceof VariableNode && collabsedRight instanceof ValueNode) {
                    collabsedLeft.amount *= collabsedRight.value
                    return collabsedLeft
                }
                if (collabsedLeft instanceof ValueNode && collabsedRight instanceof VariableNode) {
                    collabsedRight.amount *= collabsedLeft.value
                    return collabsedRight
                }
                break
            case OperatorType.Divide:
                if (collabsedLeft instanceof ValueNode && collabsedRight instanceof ValueNode) {
                    const gcd = greatestCommonDivisor(collabsedLeft.value, collabsedRight.value)
                    collabsedLeft.value /= gcd
                    collabsedRight.value /= gcd
                }

                if (collabsedRight instanceof ValueNode && collabsedRight.value === 1) {
                    return collabsedLeft
                }
                break
        }

        this.left = collabsedLeft
        this.right = collabsedRight
        return this
    }

    copy(): Node {
        return new OperatorNode(this.left.copy(), this.right.copy(), this.operatorType)
    }
}

export class ParenthesesNode extends Node {
    content: Node

    constructor(content: Node) {
        super()
        this.content = content
    }

    to_string(): string {
        return `(${this.content.to_string()})`
    }

    collabse(): Node {
        return this.content.collabse()
    }

    copy(): Node {
        return new ParenthesesNode(this.content.copy())
    }
}

export class EqualNode extends Node {
    left: Node
    right: Node
    isCalculated: boolean

    constructor(left: Node, right: Node, isCalcualted: boolean) {
        super()
        this.left = left
        this.right = right
        this.isCalculated = isCalcualted
    }

    to_string(): string {
        if (this.isCalculated) {
            return `(${this.left.to_string()} = calc(${this.right.to_string()}))`
        }
        return `(${this.left.to_string()} = ${this.right.to_string()})`
    }

    collabse(): Node {
        return this
    }

    copy(): Node {
        return new EqualNode(this.left.copy(), this.right.copy(), this.isCalculated)
    }
}

export class VariableNode extends Node {
    identifier: string
    amount: number
    variablesMap: Map<string, EqualNode>

    constructor(identifier: string, amount: number, variablesMap: Map<string, EqualNode>) {
        super()
        this.identifier = identifier
        this.amount = amount
        this.variablesMap = variablesMap
    }

    to_string(): string {
        return `(${this.amount}${this.identifier})`
    }

    collabse(): Node {
        if (this.variablesMap.has(this.identifier)) {
            return new OperatorNode(new ValueNode(this.amount), this.variablesMap.get(this.identifier)!.right.copy(), OperatorType.Multiply).collabse()
        }
        return this
    }

    copy(): Node {
        return new VariableNode(this.identifier, this.amount, this.variablesMap)
    }
}