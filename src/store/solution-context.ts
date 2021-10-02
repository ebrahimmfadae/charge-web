import { createContext, useContext } from "react"
import { Solution } from "../models/state-model"

export const init = () =>
   ({
      status: "unsolved",
      cost: 0,
      constraints: [],
      variables: [],
      weight: 0,
      capacity: 0,
      rules: {
         weight: 500,
         capacity: 5000,
         unlimitedCapacity: false,
         unlimitedIngredients: false,
         allowShrinkBase: false,
         looseConstraints: false,
         preferWightOverChemicals: false,
      },
   } as Solution)

export const SolutionProvider = createContext({
   store: init(),
   dispatch: (action: { type: string; payload?: any }) => {},
})

export const useSolution = () => useContext(SolutionProvider)
