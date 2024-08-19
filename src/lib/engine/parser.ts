import { EqualNode, type Node, OperatorNode, OperatorType, ParenthesesNode, ValueNode, VariableNode } from "./equation"
import { Lexer, TokenType, type Token } from "./lexer"

export function parse(text: string, variablesMap: Map<string, EqualNode>) {
    const lexer = new Lexer(text)
    const tokens = lexer.tokenze()
    const parser = new Parser(tokens, variablesMap)
    return parser.parse() ?? text
}

class Parser {
    public tokens: Token[]
    public variablesMap: Map<string, EqualNode>

    private pointer: number

    constructor(tokens: Token[], variablesMap: Map<string, EqualNode>) {
        this.tokens = tokens
        this.pointer = 0
        this.variablesMap = variablesMap
    }

    public parse(): Node | undefined | string {
        if (this.tokens.length === 0) return ""
        return this.Expr()
    }

    private Expr(): Node | undefined | string {
        const left = this.ArithExpr()
        if (typeof left === "string" || typeof left === "undefined") {
            return left
        }
        const currentToken = this.tokens[this.pointer]
        if (currentToken?.tokenType === TokenType.Equal) {
            this.pointer += 1
            const right = this.ArithExpr()
            if (typeof right === "string") {
                return right
            }
            if (typeof right === "undefined") {
                return new EqualNode(left, left.copy().collabse(), true)
            }
            return new EqualNode(left, right, false)
        }
        return left
    }

    private ArithExpr(): Node | undefined | string {
        let left = this.Term()
        if (typeof left === "string" || typeof left === "undefined") {
            return left
        }
        let currentToken = this.tokens[this.pointer]
        while (currentToken?.tokenType === TokenType.Operator) {
            switch (currentToken.value) {
                case "+": {
                    this.pointer += 1
                    const right = this.Term()
                    if (typeof right === "string" || typeof right === "undefined") {
                        return right
                    }
                    left =  new OperatorNode(left, right, OperatorType.Plus)
                    break
                }
                case "-": {
                    this.pointer += 1
                    const right = this.Term()
                    if (typeof right === "string" || typeof right === "undefined") {
                        return right
                    }
                    left =  new OperatorNode(left, right, OperatorType.Minus)
                    break
                } 
                default: {
                    return left
                }
            }
            currentToken = this.tokens[this.pointer]
        }
        return left
    }

    private Term(): Node | undefined | string {
        let left = this.Factor()
        if (typeof left === "string" || typeof left === "undefined") {
            return left
        }
        let currentToken = this.tokens[this.pointer]
        while (currentToken?.tokenType === TokenType.Operator) {
            switch (currentToken.value) {
                case "*": {
                    this.pointer += 1
                    const right = this.Factor()
                    if (typeof right === "string" || typeof right === "undefined") {
                        return right
                    }
                    left =  new OperatorNode(left, right, OperatorType.Multiply)
                    break
                }  
                case "/": {
                    this.pointer += 1
                    const right = this.Factor()
                    if (typeof right === "string" || typeof right === "undefined") {
                        return left
                    }
                    left =  new OperatorNode(left, right, OperatorType.Divide)
                    break
                }
                default: {
                    return left
                }
            }
            currentToken = this.tokens[this.pointer]
        }
        return left
    }

    private Factor(): Node | undefined | string {
        return this.Literal()
    }

    private Literal(): Node | undefined | string {
        let currentToken = this.tokens[this.pointer]
        if (currentToken?.tokenType === TokenType.Number) {
            const value = parseFloat((currentToken.value ?? "").replaceAll(",", "."))
            this.pointer += 1
            currentToken = this.tokens[this.pointer]
            if (currentToken?.tokenType === TokenType.Identifier) {
                this.pointer += 1
                if (!currentToken.value) {
                    return "Expected identifier"
                }
                return new VariableNode(currentToken.value, value, this.variablesMap)
            }
            return new ValueNode(value)
        } else if (currentToken?.tokenType === TokenType.OpenParam) {
            this.pointer += 1
            const expr = this.ArithExpr()
            if (typeof expr === "string" || typeof expr === "undefined") {
                return expr
            }
            currentToken = this.tokens[this.pointer]
            if (currentToken?.tokenType === TokenType.CloseParam) {
                this.pointer += 1
                return new ParenthesesNode(expr)
            }
            return "Missing end param"
        } else if (currentToken?.tokenType === TokenType.Identifier) {
            if (!currentToken.value) {
                return "Expected identifier"
            }
            this.pointer += 1
            return new VariableNode(currentToken.value, 1, this.variablesMap)
        } else if (currentToken?.tokenType === TokenType.UnknownChar) {
            return `Unexpected char (${currentToken.value})`
        }
    }
}