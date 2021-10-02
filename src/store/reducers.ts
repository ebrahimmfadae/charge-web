import { Solution } from "../models/state-model"
import { init } from "./solution-context"

export const reducer = (state: Solution, action: any): Solution => {
   switch (action.type) {
      case "ADD_CONSTRAINT": {
         const constraints = [...state.constraints, action.payload]
         return {
            ...state,
            constraints,
            status: "unsolved",
         }
      }
      case "EDIT_CONSTRAINT": {
         const constraints = [...state.constraints]
         const item = constraints[action.payload.index]
         constraints[action.payload.index] = { ...item, ...action.payload.data }
         return { ...state, constraints, status: "unsolved" }
      }
      case "REMOVE_CONSTRAINT": {
         const constraints = [...state.constraints]
         constraints.splice(action.payload, 1)
         return { ...state, constraints, status: "unsolved" }
      }
      case "ADD_VARIABLE": {
         const variables = [...state.variables, action.payload]
         return {
            ...state,
            variables,
         }
      }
      case "EDIT_VARIABLE": {
         const variables = [...state.variables]
         const item = variables[action.payload.index]
         variables[action.payload.index] = { ...item, ...action.payload.data }
         return { ...state, variables, status: "unsolved" }
      }
      case "REMOVE_VARIABLE": {
         const variables = state.variables.filter(
            (_, i) => !action.payload.includes(i)
         )
         return { ...state, variables, status: "unsolved" }
      }
      case "SET_RULES":
         return {
            ...state,
            rules: { ...state.rules, ...action.payload },
            status: "unsolved",
         }
      case "SOLVE":
         return {
            ...state,
            status: action.payload.status,
            cost: action.payload.cost,
            weight: action.payload.weight,
            variables: state.variables.map((v, i) => ({
               ...v,
               amount: action.payload.variables[i],
            })),
            constraints: state.constraints.map((v, i) => {
               return {
                  ...v,
                  isSatisfied:
                     action.payload.constraints[i] <= v.max &&
                     action.payload.constraints[i] >= v.min,
                  value: action.payload.constraints[i],
               }
            }),
         }
      case "RESET":
         return init()
      default:
         return state
   }
}
