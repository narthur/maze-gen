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
  
  // Handle win animation
  if (state.solved) {
    const canvas = document.querySelector<HTMLCanvasElement>("#maze-canvas")!;
    canvas.classList.add('zoom-to-win');
    
    // Reset after animation
    setTimeout(() => {
      canvas.classList.remove('zoom-to-win');
      state = getInitialState();
      requestAnimationFrame(step);
    }, 1500);
    return; // Pause simulation while animating
  }
  
  requestAnimationFrame(step);
}

// Start animation
step();
