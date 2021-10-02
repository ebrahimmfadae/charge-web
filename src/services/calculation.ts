import Solver from "javascript-lp-solver"
import {
   ConstraintModel,
   Result,
   Solution,
   Variable
} from "../models/state-model"
import { ModelBuilder } from "./model-builder"

export const calculateConstraints = (
   constraints: ConstraintModel[],
   variables: Variable[],
   weight: number,
   result: any
) => {
   return constraints.map(
      (c) =>
         variables
            .map((v) => {
               const comp =
                  Number(
                     v.ingredient.composition.find(
                        (i) => i.chemical.id === c.composition!.id
                     )?.value
                  ) ?? 0
               return (
                  (result[v.ingredient.name] ?? 0) *
                  (1 - Number(v.ingredient.pertPercentage) / 100) *
                  comp
               )
            })
            .reduce((a, b) => a + b) / weight
   )
}

export const optimize = (solution: Solution): Result => {
   if (!solution.variables.length)
      return {
         status: "infeasible",
         cost: 0,
         weight: 0,
         variables: [],
         constraints: [],
      }
   const model = new ModelBuilder().buildModel(solution)
   const result = Solver.Solve(model)
   return result.feasible
      ? {
           status: "solved",
           cost: result.result,
           weight: solution.variables
              .map(
                 (v) =>
                    (result[v.ingredient.name] ?? 0) *
                    (1 - Number(v.ingredient.pertPercentage) / 100)
              )
              .reduce((a, b) => a + b),
           variables: solution.variables.map(
              (v) => result[v.ingredient.name] ?? 0
           ),
           constraints: calculateConstraints(
              solution.constraints,
              solution.variables,
              Number(solution.rules.weight),
              result
           ),
        }
      : {
           status: "infeasible",
           cost: 0,
           weight: 0,
           variables: solution.variables.map((v) => ""),
           constraints: solution.constraints.map((v) => ""),
        }
}
