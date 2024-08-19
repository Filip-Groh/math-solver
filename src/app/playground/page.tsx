"use client"

import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import React from 'react'
import AddButton from '~/components/custom/addButton'
import Keyboard from '~/components/custom/keyboard'
import Equation from '~/components/equations/equation'
import EquationsBuilder from '~/components/equations/equationsBuilder'
import { useArray } from '~/components/hooks/useArray'
import { useMap } from '~/components/hooks/useMap'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable"
import { EqualNode, OperatorNode, OperatorType, ValueNode, VariableNode, type Node } from '~/lib/engine/equation'
import { parse } from '~/lib/engine/parser'
  
const Page = () => {
    const {map: variables, add: addVariables, remove: removeVariables} = useMap<string, EqualNode>()

    const {state: equations, push: pushEquations, pop: popEquations} = useArray<Node>([])

    const [equation, setEquation] = React.useState("6+a/6*9=")
    const [tree, setTree] = React.useState<Node>()
    const [error, setError] = React.useState("")

    const [variableCompatible, setVariableCompatible] = React.useState(false)
    const [equationCompatible, setEquationCompatible] = React.useState(false)

    React.useEffect(() => {
        if (!(tree instanceof EqualNode)) {
            setVariableCompatible(false)
        } else if (!(tree.left instanceof VariableNode)) {
            setVariableCompatible(false)
        } else {
            setVariableCompatible(true)
        }
    }, [tree])

    React.useEffect(() => {
        const parsed = parse(equation, variables.data)
        if (typeof parsed === "string") {
            setTree(undefined)
            setError(parsed)
        } else {
            setTree(parsed)
            setError("")
        }
    }, [equation, variables])

    const addVariable = () => {
        if (!tree || !(tree instanceof EqualNode) || !(tree.left instanceof VariableNode)) {
            return
        }
        tree.right = new OperatorNode(tree.right, new ValueNode(tree.left.amount), OperatorType.Divide).collabse()
        addVariables(tree.left.identifier, tree)
        setEquation("")
    }

    const addEquation = () => {
        pushEquations(tree!)
        setEquation("")
    }
    
    return (
        <ResizablePanelGroup direction="horizontal" className='rounded-lg border'>
            <ResizablePanel>
                {Array.from(variables.data.values()).map((variable, index) => {
                    if (!(variable.left instanceof VariableNode)) return
                    return <Equation key={`variableList_${index}`} tree={variable} mapKey={variable.left.identifier} remove={removeVariables}/>
                })}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel className='flex flex-col'>
                        <div className='flex-grow flex flex-row justify-center items-center'>
                            {tree ? <EquationsBuilder tree={tree} /> : <p>{error}</p>}
                        </div>
                        <div className='flex flex-row justify-between m-2'>
                            <AddButton tooltipText="Add to variables" disabled={!variableCompatible} onClick={addVariable}>
                                <ArrowBigLeft />
                            </AddButton>
                            <AddButton tooltipText="Add to equations" disabled={!equationCompatible} onClick={addEquation}>
                                <ArrowBigRight />
                            </AddButton>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel>
                        <Keyboard equation={equation} setEquation={setEquation} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                {equations.map((equation, index) => {
                    return <Equation key={`equationList_${index}`} tree={equation} index={index} pop={popEquations}/>
                })}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default Page
  