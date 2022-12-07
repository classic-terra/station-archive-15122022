import createContext from "utils/createContext"
import { TaxParams } from "../utils"

export const [useTaxParams, TaxParamsProvider] =
  createContext<TaxParams>("useTaxParams")
