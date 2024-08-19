export enum TokenType {
    UnknownChar,
    Number,
    Operator,
    OpenParam,
    CloseParam,
    Equal,
    Identifier
}

export type Token = {
    tokenType: TokenType,
    value?: string
}

export class Lexer {
    public text: string

    private pointer: number
    private currentChar: string

    constructor(text: string) {
        this.text = text
        this.pointer = -1
        this.currentChar = ""
    }

    private step(stepLength?: number) {
        this.pointer += stepLength ?? 1
        const newChar = this.text[this.pointer]
        switch(typeof newChar) {
            case "string": {
                this.currentChar = newChar
                return true
            }
            case "undefined": {
                return false
            }
        }
    }

    public tokenze() {
        const tokenOutput: Token[] = []

        while (this.step()) {
            if (" ".includes(this.currentChar)) continue
            else if ("0123456789,.".includes(this.currentChar)) {
                let numberString = this.currentChar
                while (this.step() && "0123456789,.".includes(this.currentChar)) {
                    numberString += this.currentChar
                }
                this.step(-1)
                tokenOutput.push({
                    tokenType: TokenType.Number,
                    value: numberString
                })
            } else if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(this.currentChar)) {
                let identifier = this.currentChar
                while (this.step() && "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(this.currentChar)) {
                    identifier += this.currentChar
                }
                this.step(-1)
                tokenOutput.push({
                    tokenType: TokenType.Identifier,
                    value: identifier
                })
            } else if (this.currentChar === "(") {
                tokenOutput.push({
                    tokenType: TokenType.OpenParam
                })
            } else if (this.currentChar === ")") {
                tokenOutput.push({
                    tokenType: TokenType.CloseParam
                })
            } else if (this.currentChar === "=") {
                tokenOutput.push({
                    tokenType: TokenType.Equal
                })
            } else if ("+-*/".includes(this.currentChar)) {
                tokenOutput.push({
                    tokenType: TokenType.Operator,
                    value: this.currentChar
                })
            } else {
                tokenOutput.push({
                    tokenType: TokenType.UnknownChar,
                    value: this.currentChar
                })
            }
        }
        return tokenOutput
    }
}