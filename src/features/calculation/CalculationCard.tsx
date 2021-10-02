import {
   Button,
   Card,
   Classes,
   Divider,
   FormGroup,
   InputGroup,
   Switch,
} from "@blueprintjs/core"
import React, { useCallback } from "react"
import { solve } from "../../store/actions"
import { useSolution } from "../../store/solution-context"

export const CalculationCard = (props: { openConstraints?: () => void }) => {
   const { store, dispatch } = useSolution()
   const {
      status,
      rules: { weight, capacity, unlimitedCapacity },
   } = store
   const onSolveCb = useCallback(() => {
      dispatch({ type: "SOLVE", payload: solve(store) })
   }, [dispatch, store])
   return (
      <Card style={{ flexShrink: 0 }}>
         <div style={{ width: "max-content" }}>
            <FormGroup
               label="Weight"
               labelFor="weight"
               inline
               style={{ float: "right", clear: "both" }}
            >
               <InputGroup
                  id="weight"
                  value={weight.toString()}
                  onChange={({ target: { value } }) => {
                     dispatch({ type: "SET_RULES", payload: { weight: value } })
                  }}
               />
            </FormGroup>
            <FormGroup
               label="Capacity"
               labelFor="capacity"
               disabled={unlimitedCapacity}
               inline
               style={{ float: "right", clear: "both" }}
            >
               <InputGroup
                  id="capacity"
                  disabled={unlimitedCapacity}
                  value={capacity.toString()}
                  onChange={({ target: { value } }) => {
                     dispatch({
                        type: "SET_RULES",
                        payload: { capacity: value },
                     })
                  }}
               />
            </FormGroup>
         </div>
         <Button fill onClick={props.openConstraints}>
            Edit Constraints
         </Button>
         <div style={{ margin: "10px 0" }}>
            <Card>
               <Switch
                  label="Allow to shrink base"
                  checked={store.rules.allowShrinkBase}
                  onChange={(event: any) => {
                     const { checked } = event.target
                     dispatch({
                        type: "SET_RULES",
                        payload: { allowShrinkBase: checked },
                     })
                  }}
               />
               <Switch
                  label="Loose constraints"
                  checked={store.rules.looseConstraints}
                  onChange={(event: any) => {
                     const { checked } = event.target
                     dispatch({
                        type: "SET_RULES",
                        payload: { looseConstraints: checked },
                     })
                  }}
               />
               <Switch
                  label="Prefer correct constraints over correct wight"
                  disabled={
                     !store.rules.allowShrinkBase ||
                     !store.rules.looseConstraints
                  }
                  checked={store.rules.preferWightOverChemicals}
                  onChange={(event: any) => {
                     const { checked } = event.target
                     dispatch({
                        type: "SET_RULES",
                        payload: { preferWightOverChemicals: checked },
                     })
                  }}
               />
               <Divider />
               <Switch
                  label="Unlimited capacity"
                  checked={store.rules.unlimitedCapacity}
                  onChange={(event: any) => {
                     const { checked } = event.target
                     dispatch({
                        type: "SET_RULES",
                        payload: { unlimitedCapacity: checked },
                     })
                  }}
               />
               <Switch
                  label="Unlimited materials"
                  checked={store.rules.unlimitedIngredients}
                  onChange={(event: any) => {
                     const { checked } = event.target
                     dispatch({
                        type: "SET_RULES",
                        payload: { unlimitedIngredients: checked },
                     })
                  }}
               />
            </Card>
         </div>
         <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
               intent="primary"
               disabled={status === "solved"}
               onClick={onSolveCb}
            >
               Solve
            </Button>
         </div>
      </Card>
   )
}
