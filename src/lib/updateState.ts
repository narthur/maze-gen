import type { State } from "../types";
import { applyGenerationStep } from "./applyGenerationStep";
import { applySolveStep } from "./applySolveStep";

export function updateState(prevState: State): State {
  if (prevState.phase === 'generating') {
    return applyGenerationStep(prevState);
  } else {
    return applySolveStep(prevState);
  }
}
