import { Button, Card, Classes } from "@blueprintjs/core"
import {
   Cell,
   CellRenderer,
   Column,
   EditableCell2,
   Region,
   Table2,
} from "@blueprintjs/table"
import React, { useCallback, useState } from "react"
import { useDialog } from "../../hooks"
import { Ingredient, Variable } from "../../models/state-model"
import { useApp } from "../../store/app-context"
import { useSolution } from "../../store/solution-context"
import { IngredientDialog } from "./IngredientDialog"

let id = 0

const createIngredient = (): Ingredient => ({
   id: `${++id}`,
   name: `Ingredient${id}`,
   content: 100000,
   countable: false,
   pertPercentage: 0,
   price: 6000000,
   composition: [],
})

export const Ingredients = () => {
   const {
      store: { chemicals },
   } = useApp()
   const {
      store: { variables },
      dispatch,
   } = useSolution()
   const [selected, setSelected] = useState<Variable[]>([])
   const [newPlaceholder, setNewPlaceholder] = useState<
      Ingredient | undefined
   >()
   const editIngredientDialog = useDialog()
   const deleteIngredients = useCallback(() => {
      if (selected.length) {
         dispatch({
            type: "REMOVE_VARIABLE",
            payload: selected.map((v) =>
               variables.findIndex(
                  (item) => item.ingredient.id === v.ingredient.id
               )
            ),
         })
         setSelected([])
      }
   }, [variables, dispatch, selected, setSelected])
   const editIngredientDialog_open = editIngredientDialog.open
   const addIngredient = useCallback(() => {
      const val = createIngredient()
      val.composition = chemicals.map((chemical) => ({ chemical, value: 0 }))
      setNewPlaceholder(val)
      editIngredientDialog_open()
   }, [chemicals, editIngredientDialog_open, setNewPlaceholder])
   const cellRenderer = useCallback<CellRenderer>(
      (rowIndex, columnIndex) => {
         const variable = variables[rowIndex]
         let propName: "" | keyof Variable = ""
         let value = ""
         let editable = false
         switch (columnIndex) {
            case 0:
               value = variable.ingredient.name
               break
            case 1:
               value = variable.ingredient.price.toString()
               break
            case 2:
               propName = "min"
               value = variable.min.toString()
               editable = true
               break
            case 3:
               propName = "max"
               value = variable.max.toString()
               editable = true
               break
            case 4:
               propName = "amount"
               value = variable.amount?.toString() ?? ""
               break
         }
         return editable ? (
            <EditableCell2
               style={{ fontSize: "11pt" }}
               value={value}
               rowIndex={rowIndex}
               onChange={(v, index) => {
                  if (propName) {
                     dispatch({
                        type: "EDIT_VARIABLE",
                        payload: {
                           index,
                           data: {
                              ...variable,
                              [propName]: Number(v),
                           },
                        },
                     })
                  }
               }}
            />
         ) : (
            <Cell style={{ fontSize: "11pt" }}>{value}</Cell>
         )
      },
      [variables, dispatch]
   )
   const onSelection = useCallback(
      (selectedRegions: Region[]) => {
         setSelected(
            selectedRegions.flatMap((region) => {
               if (region.rows) {
                  const [start, end] = region.rows
                  return variables.slice(start, end + 1)
               } else {
                  return []
               }
            })
         )
      },
      [variables]
   )
   const onApply = useCallback(
      (ingredient: Ingredient) => {
         if (newPlaceholder) {
            dispatch({
               type: "ADD_VARIABLE",
               payload: {
                  ingredient,
                  min: 0,
                  max: ingredient.content,
               },
            })
            setNewPlaceholder(undefined)
         } else {
            const index = variables.findIndex(
               (item) => item.ingredient.id === ingredient.id
            )
            dispatch({
               type: "EDIT_VARIABLE",
               payload: {
                  index,
                  data: {
                     ingredient,
                  },
               },
            })
         }
      },
      [variables, dispatch, newPlaceholder, setNewPlaceholder]
   )
   return (
      <>
         <IngredientDialog
            data={newPlaceholder ?? selected[0]?.ingredient}
            isOpen={editIngredientDialog.isOpen}
            onClose={() => {
               setNewPlaceholder(undefined)
               editIngredientDialog.close()
            }}
            onApply={onApply}
         />
         <Card
            style={{
               width: "100%",
               height: "100%",
               display: "flex",
               flexDirection: "column",
            }}
         >
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
               <Button
                  disabled={selected.length !== 1}
                  text="Edit"
                  onClick={editIngredientDialog.open}
               />
               <Button text="Add" intent="primary" onClick={addIngredient} />
               <Button
                  disabled={!selected.length}
                  text="Delete"
                  intent="danger"
                  onClick={deleteIngredients}
               />
            </div>
            <span style={{ display: "block", height: "10px" }} />
            <div style={{ flex: 1 }}>
               <Table2
                  numRows={variables.length}
                  enableRowResizing={false}
                  defaultRowHeight={25}
                  onSelection={onSelection}
                  enableColumnResizing={false}
               >
                  <Column name="Name" cellRenderer={cellRenderer} />
                  <Column name="Price" cellRenderer={cellRenderer} />
                  <Column name="Min" cellRenderer={cellRenderer} />
                  <Column name="Max" cellRenderer={cellRenderer} />
                  <Column name="Amount" cellRenderer={cellRenderer} />
               </Table2>
            </div>
         </Card>
      </>
   )
}
