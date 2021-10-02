import { Callout, Icon, Label } from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import { Cell, CellRenderer, Column, Table2 } from "@blueprintjs/table"
import React, { useCallback } from "react"
import { useSolution } from "../../store/solution-context"

export const ResultCard = () => {
   const {
      store: { status, cost, weight, constraints },
   } = useSolution()
   const cellRenderer = useCallback<CellRenderer>(
      (rowIndex, columnIndex) => {
         const v = constraints[rowIndex]
         let value: string = ""
         switch (columnIndex) {
            case 0:
               value = `${v.min} ≤ ${v.composition?.name ?? ""} ≤ ${v.max}`
               break
            case 1:
               value = v.value?.toString() ?? ""
               break
         }
         return <Cell style={{ fontSize: "11pt" }}>{value}</Cell>
      },
      [constraints]
   )
   const correctCellRenderer = useCallback<CellRenderer>(
      (rowIndex) => {
         const v = constraints[rowIndex]
         return (
            <Cell style={{ fontSize: "11pt" }}>
               {v.isSatisfied ? (
                  <Icon intent="success" icon={IconNames.TICK} />
               ) : (
                  <Icon intent="danger" icon={IconNames.CROSS} />
               )}
            </Cell>
         )
      },
      [constraints]
   )
   return (
      <Callout
         icon={status === "solved" ? IconNames.TICK : IconNames.CIRCLE}
         intent={status === "solved" ? "success" : "warning"}
      >
         {status === "solved" && (
            <div>
               <Label>{`Cost: ${cost} (${
                  Number(cost) / Number(weight)
               }/unit)`}</Label>
               <Label>{` Weight: ${weight}`}</Label>
               <Table2
                  numRows={constraints.length}
                  enableRowResizing={false}
                  defaultRowHeight={25}
                  enableRowHeader={false}
                  enableColumnResizing={false}
                  columnWidths={[null, null, 40]}
               >
                  <Column name="Constraint" cellRenderer={cellRenderer} />
                  <Column name="Amount" cellRenderer={cellRenderer} />
                  <Column name="" cellRenderer={correctCellRenderer} />
               </Table2>
            </div>
         )}
         {status === "unsolved" && "Press Solve button."}
         {status === "infeasible" &&
            "The problem is unsolvable. Try again after changing constraints or rules."}
      </Callout>
   )
}
