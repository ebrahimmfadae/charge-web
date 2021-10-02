import { InputGroup, InputGroupProps2, Tooltip } from "@blueprintjs/core"
import React from "react"

export const ValidInput = (
   props: {
      error?: string
      warning?: string
   } & Omit<InputGroupProps2, "intent">
) => {
   const { error, warning, ...inputProps } = props
   const hasError = !!error
   const hasWarning = !!warning
   const intent = (hasError && "danger") || (hasWarning && "warning") || "none"
   return (
      <Tooltip
         disabled={!hasError && !hasWarning}
         content={error || warning}
         intent={intent}
      >
         <InputGroup {...inputProps} intent={intent} />
      </Tooltip>
   )
}
