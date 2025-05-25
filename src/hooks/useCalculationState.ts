
import { useCalculationStateManager, CalculationStateProps } from "./useCalculationStateManager";

export { type CalculationStateProps, type CalculationData, type Layer } from "./useCalculationStateManager";

export const useCalculationState = (props: CalculationStateProps) => {
  return useCalculationStateManager(props);
};
