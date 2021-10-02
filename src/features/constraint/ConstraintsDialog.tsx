import {
   Button,
   Classes,
   Dialog,
   Divider,
   Menu,
   MenuItem,
} from "@blueprintjs/core"
import React, { useCallback } from "react"
import { useDialog } from "../../hooks"
import { useApp } from "../../store/app-context"
import { useSolution } from "../../store/solution-context"
import { Constraint } from "./Constraint"

let id = 1

export const ConstraintsDialog = (props: {
   isOpen?: boolean
   onClose?: () => void
}) => {
   const {
      store: { chemicals },
   } = useApp()
   const {
      store: { constraints },
      dispatch,
   } = useSolution()
   const deleteConstraint = useCallback(
      (index: number) =>
         dispatch({ type: "REMOVE_CONSTRAINT", payload: index }),
      [dispatch]
   )
   const addConstraint = useCallback(
      () =>
         dispatch({
            type: "ADD_CONSTRAINT",
            payload: {
               id: `${id++}`,
               isSatisfied: false,
               composition: chemicals[0],
               max: 0,
               min: 0,
            },
         }),
      [chemicals, dispatch]
   )
   const chemicalDialog = useDialog()
   return (
      <div>
         <Dialog
            isOpen={chemicalDialog.isOpen}
            onClose={chemicalDialog.close}
            style={{ width: "250px", minHeight: "400px" }}
         >
            <div className={Classes.DIALOG_BODY}>
               <Menu>
                  {chemicals.map((v, i, arr) => (
                     <div>
                        <MenuItem
                           text={v.name}
                           onClick={() => {
                              dispatch({
                                 type: "EDIT_CONSTRAINT",
                                 payload: {
                                    index: chemicalDialog.data,
                                    data: {
                                       composition: v,
                                    },
                                 },
                              })
                              chemicalDialog.close()
                           }}
                        />
                        {i !== arr.length - 1 && <Divider />}
                     </div>
                  ))}
               </Menu>
            </div>
         </Dialog>
         <Dialog
            title="Edit Constraints"
            isOpen={props.isOpen}
            onClose={props.onClose}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
            style={{ width: "600px", minHeight: "350px" }}
         >
            <div className={Classes.DIALOG_BODY}>
               {constraints.length ? (
                  constraints.map((item, i, arr) => {
                     return (
                        <div key={item.id}>
                           <Constraint
                              index={i}
                              onDelete={deleteConstraint}
                              onClickChemical={() => chemicalDialog.open(i)}
                           />
                           {i !== arr.length - 1 && <Divider />}
                        </div>
                     )
                  })
               ) : (
                  <span
                     style={{
                        textAlign: "center",
                        color: "dimgray",
                        display: "block",
                     }}
                  >
                     - no constraints -
                  </span>
               )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
               <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  {constraints.length ? undefined : (
                     <span style={{ color: "dimgray", alignSelf: "center" }}>
                        Press to add first constraint
                     </span>
                  )}
                  <Button
                     text="Add"
                     intent="primary"
                     style={{ width: "80px" }}
                     onClick={addConstraint}
                  />
               </div>
            </div>
         </Dialog>
      </div>
   )
}
