import { createContext, useContext } from "react"
import { Chemical } from "../models/state-model"

export const init = () => ({
   chemicals: [
      {
         id: "c",
         name: "C",
      },
      {
         id: "fe",
         name: "Fe",
      },
      {
         id: "si",
         name: "Si",
      },
      {
         id: "mg",
         name: "Mg",
      },
      {
         id: "mn",
         name: "Mn",
      },
      {
         id: "ni",
         name: "Ni",
      },
   ] as Chemical[],
})

export const AppProvider = createContext({
   store: init(),
   dispatch: (action: { type: string; payload?: any }) => {},
})

export const useApp = () => useContext(AppProvider)
