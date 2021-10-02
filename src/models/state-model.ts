export interface Chemical {
   id: string
   name: string
}

export interface Composition {
   chemical: Chemical
   value: string | number
}

export interface Ingredient {
   id: string
   name: string
   price: string | number
   content: string | number
   pertPercentage: string | number
   countable: boolean
   unitWeight?: string | number
   composition: Composition[]
}

export interface Variable {
   ingredient: Ingredient
   min: string | number
   max: string | number
   amount?: string | number
}

export interface ConstraintModel {
   id: string
   composition: Chemical
   min: string | number
   max: string | number
   value?: string | number
   isSatisfied: boolean
}

export interface Solution {
   status: "infeasible" | "solved" | "unsolved"
   cost: string | number
   constraints: ConstraintModel[]
   variables: Variable[]
   weight: string | number
   capacity: string | number
   rules: {
      weight: string | number
      capacity: string | number
      unlimitedCapacity: boolean
      unlimitedIngredients: boolean
      allowShrinkBase: boolean
      looseConstraints: boolean
      preferWightOverChemicals: boolean
   }
}

export interface Result {
   status: "infeasible" | "solved" | "unsolved"
   cost: string | number
   weight: string | number
   variables: (string | number)[]
   constraints: (string | number)[]
}
