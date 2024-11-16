import "./style.css";
import { getInitialState } from "./lib/getInitialState";
import { updateState } from "./lib/updateState";
import { renderState } from "./lib/renderState";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <div>
    <canvas id="maze-canvas"></canvas>
  </div>
`;

// Initialize and start
let state = getInitialState();

function step() {
  console.log("step");
  state = updateState(state);
  renderState(state);
  
  // Reset when solved
  if (state.solved) {
    state = getInitialState();
  }
  
  requestAnimationFrame(step);
}

// Start animation
step();
