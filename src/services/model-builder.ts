import { ConstraintModel, Solution, Variable } from "../models/state-model"

export class ModelBuilder {
   private static merge(sources: any[]) {
      return Object.assign({}, ...sources)
   }

   static constraints = (solution: Solution) => {
      return {
         weight: { equal: Number(solution.rules.weight) },
         capacity: solution.rules.unlimitedCapacity
            ? { min: 0 }
            : { max: Number(solution.rules.capacity) },
         ...ModelBuilder.chemicalConstraints(
            solution.constraints,
            Number(solution.rules.weight)
         ),
         ...ModelBuilder.boundaryConstraints(
            solution.variables,
            solution.rules.unlimitedIngredients
         ),
      }
   }

   static boundaryConstraints = (
      variables: Variable[],
      unlimitedIngredients?: boolean
   ) => {
      return ModelBuilder.merge(
         variables.map((v) => ({
            [v.ingredient.name]: unlimitedIngredients
               ? { min: Number(v.min) }
               : { min: Number(v.min), max: Number(v.max) },
         }))
      )
   }

   static chemicalConstraints = (
      constraints: ConstraintModel[],
      weight: number
   ) => {
      return ModelBuilder.merge(
         constraints.map((c) => ({
            [`${c.composition!.id}_min`]: {
               min: 0,
            },
            [`${c.composition!.id}_max`]: {
               max: 0,
            },
         }))
      )
   }

   static chemicalCoefficients = (
      constraints: ConstraintModel[],
      variable: Variable
   ) => {
      return ModelBuilder.merge(
         constraints.map((c) => {
            const cmp =
               Number(
                  variable.ingredient.composition.find(
                     (i) => i.chemical.id === c.composition!.id
                  )?.value
               ) ?? 0
            const remain = 1 - Number(variable.ingredient.pertPercentage) / 100
            return {
               [`${c.composition!.id}_min`]: (cmp - Number(c.min)) * remain,
               [`${c.composition!.id}_max`]: (cmp - Number(c.max)) * remain,
            }
         })
      )
   }

   static coefficients = (
      constraints: ConstraintModel[],
      variables: Variable[]
   ) => {
      return ModelBuilder.merge(
         variables.map((v) => ({
            [v.ingredient.name]: {
               [v.ingredient.name]: 1,
               weight: 1 - Number(v.ingredient.pertPercentage) / 100,
               capacity: 1,
               cost: v.ingredient.price,
               ...ModelBuilder.chemicalCoefficients(constraints, v),
            },
         }))
      )
   }

   buildModel(solution: Solution) {
      return {
         optimize: "cost",
         opType: "min",
         constraints: ModelBuilder.constraints(solution),
         variables: ModelBuilder.coefficients(
            solution.constraints,
            solution.variables
         ),
      }
   }
}
