import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/select/lib/css/blueprint-select.css"
import "@blueprintjs/table/lib/css/table.css"
import React, { useReducer } from "react"
import "./App.css"
import { CalculationCard } from "./features/calculation/CalculationCard"
import { ResultCard } from "./features/calculation/ResultCard"
import { ConstraintsDialog } from "./features/constraint/ConstraintsDialog"
import { Ingredients } from "./features/ingredient/Ingredients"
import { useDialog } from "./hooks"
import { AppProvider, init as initApp } from "./store/app-context"
import { reducer } from "./store/reducers"
import {
   init as initSolution,
   SolutionProvider,
} from "./store/solution-context"

function App() {
   const constraintsDialog = useDialog()
   const [solution, dispatchSolution] = useReducer(reducer, initSolution())
   const [app, dispatchApp] = useReducer((state) => {
      return state
   }, initApp())
   return (
      <AppProvider.Provider value={{ store: app, dispatch: dispatchApp }}>
         <SolutionProvider.Provider
            value={{ store: solution, dispatch: dispatchSolution }}
         >
            <div className="main">
               <ConstraintsDialog
                  isOpen={constraintsDialog.isOpen}
                  onClose={constraintsDialog.close}
               />
               <div style={{ display: "flex" }}>
                  <div style={{ flexGrow: 0 }}>
                     <CalculationCard
                        openConstraints={constraintsDialog.open}
                     />
                     <span
                        style={{
                           display: "block",
                           height: "10px",
                           flexShrink: 0,
                        }}
                     />
                     <ResultCard />
                  </div>
                  <span style={{ width: "10px", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                     <Ingredients />
                  </div>
               </div>
            </div>
         </SolutionProvider.Provider>
      </AppProvider.Provider>
   )
}

export default App
