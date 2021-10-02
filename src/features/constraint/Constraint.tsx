import { Button } from "@blueprintjs/core"
import React, { useCallback } from "react"
import { ValidInput } from "../../components/ValidInput"
import { Chemical } from "../../models/state-model"
import { useSolution } from "../../store/solution-context"

export const Constraint = (props: {
   index: number
   onClickChemical?: (chemical?: Chemical) => void
   onDelete?: (index: number) => void
}) => {
   const {
      store: { constraints },
      dispatch,
   } = useSolution()
   const { min, max, composition } = constraints[props.index]
   const { onDelete: onDeleteCb, index } = props
   const onDelete = useCallback(() => onDeleteCb?.(index), [onDeleteCb, index])
   const error =
      min <= max ? "" : "Min value must be less or equal than Max value"
   const compareStyle = {
      color: "dimgray",
      width: "fit-content",
      alignSelf: "center",
      padding: "0 3px",
   }
   return (
      <div style={{ display: "flex" }}>
         <ValidInput
            error={error}
            value={min.toString()}
            onChange={({ target: { value } }) =>
               dispatch({
                  type: "EDIT_CONSTRAINT",
                  payload: {
                     index,
                     data: {
                        min: value,
                     },
                  },
               })
            }
         />
         <span style={compareStyle}>&#10092;</span>
         <Button
            text={composition?.name ?? "..."}
            style={{ width: "150px" }}
            onClick={() => props.onClickChemical?.(composition)}
         />
         <span style={compareStyle}>&#10092;</span>
         <ValidInput
            error={error}
            value={max.toString()}
            onChange={({ target: { value } }) =>
               dispatch({
                  type: "EDIT_CONSTRAINT",
                  payload: {
                     index,
                     data: {
                        max: value,
                     },
                  },
               })
            }
         />
         <span style={{ padding: "0 3px" }} />
         <Button text="Delete" intent="danger" onClick={onDelete} />
      </div>
   )
}
