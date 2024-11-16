import type { State } from "../types";
import { applyGenerationStep } from "./applyGenerationStep";

export function updateState(prevState: State): State {
  if (prevState.phase === 'generating') {
    return applyGenerationStep(prevState);
  } else {
    // Solving logic here - will implement next
    return prevState;
  }
}
