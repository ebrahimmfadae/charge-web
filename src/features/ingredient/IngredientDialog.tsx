import {
   Button,
   Classes,
   Dialog,
   FormGroup,
   InputGroup,
   Switch,
} from "@blueprintjs/core"
import { Cell, Column, EditableCell2, Table2 } from "@blueprintjs/table"
import React, { useEffect } from "react"
import { useDraftForm } from "../../hooks"
import { Ingredient } from "../../models/state-model"

export const IngredientDialog = (props: {
   data?: Ingredient
   isOpen?: boolean
   onClose?: () => void
   onApply?: (ingredient: Ingredient) => void
}) => {
   const { data } = props
   const { draft, setEntity, reset } = useDraftForm(data)
   useEffect(() => {
      reset(data)
   }, [data, reset])
   return (
      <Dialog
         title="Edit Ingredients"
         isOpen={props.isOpen}
         onClose={props.onClose}
         canOutsideClickClose={false}
         canEscapeKeyClose={false}
         style={{ width: "600px" }}
      >
         <div className={Classes.DIALOG_BODY}>
            <div style={{ display: "flex", flexDirection: "row" }}>
               <div style={{ flexShrink: 0 }}>
                  <FormGroup label="Name" labelFor="name">
                     <InputGroup
                        id="name"
                        value={draft?.name}
                        onChange={({ target: { value } }) => {
                           setEntity("name", value)
                        }}
                     />
                  </FormGroup>
                  <FormGroup label="Price" labelFor="price">
                     <InputGroup
                        id="price"
                        value={draft?.price?.toString()}
                        onChange={({ target: { value } }) => {
                           setEntity("price", value)
                        }}
                     />
                  </FormGroup>
                  <FormGroup label="Content" labelFor="content">
                     <InputGroup
                        id="content"
                        value={draft?.content?.toString()}
                        onChange={({ target: { value } }) => {
                           setEntity("content", value)
                        }}
                     />
                  </FormGroup>
                  <FormGroup label="Pert Percentage" labelFor="pertPercentage">
                     <InputGroup
                        id="pertPercentage"
                        value={draft?.pertPercentage?.toString()}
                        onChange={({ target: { value } }) => {
                           setEntity("pertPercentage", value)
                        }}
                     />
                  </FormGroup>
                  <Switch
                     label="Countable"
                     checked={draft?.countable}
                     onChange={(event: any) => {
                        setEntity("countable", event.target.checked)
                     }}
                  />
                  <FormGroup label="Unit Weight" labelFor="unitWeight">
                     <InputGroup
                        id="unitWeight"
                        value={draft?.unitWeight?.toString()}
                        onChange={({ target: { value } }) => {
                           setEntity("unitWeight", value)
                        }}
                     />
                  </FormGroup>
               </div>
               <span style={{ width: "15px" }} />
               <FormGroup
                  label="Composition"
                  style={{ width: "100%" }}
                  contentClassName={Classes.FLEX_EXPANDER}
               >
                  <Table2 numRows={draft?.composition.length}>
                     <Column
                        name="Symbol"
                        cellRenderer={(
                           rowIndex: number,
                           columnIndex: number
                        ) => {
                           return (
                              <Cell>
                                 {draft?.composition[rowIndex]?.chemical.name}
                              </Cell>
                           )
                        }}
                     />
                     <Column
                        name="Percentage"
                        cellRenderer={(
                           rowIndex: number,
                           columnIndex: number
                        ) => {
                           const composition = draft?.composition
                           return composition ? (
                              <EditableCell2
                                 style={{ fontSize: "11pt" }}
                                 value={composition[rowIndex]?.value.toString()}
                                 rowIndex={rowIndex}
                                 onChange={(v, index) => {
                                    const cmp = [...composition]
                                    cmp[index!] = {
                                       ...cmp[index!],
                                       value: Number(v),
                                    }
                                    setEntity("composition", cmp)
                                 }}
                              />
                           ) : (
                              <Cell />
                           )
                        }}
                     />
                  </Table2>
               </FormGroup>
            </div>
         </div>
         <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
               <Button
                  text="Apply"
                  intent="primary"
                  onClick={() => {
                     if (draft) props.onApply?.(draft)
                     props.onClose?.()
                  }}
               />
               <Button text="Cancel" onClick={props.onClose} />
            </div>
         </div>
      </Dialog>
   )
}
