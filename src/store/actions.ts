import { Solution } from "../models/state-model"
import { optimize } from "../services/calculation"

export const solve = (solution: Readonly<Solution>) => optimize(solution)
