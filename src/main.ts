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

let state = getInitialState();

function step() {
  console.log("step");
  state = updateState(state);
  renderState(state);

  if (state.solved) {
    state = getInitialState();
  }

  requestAnimationFrame(step);
}

step();

const referralLinks = [
  "https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f",
  "https://codebuff.com/referrals/ref-60623de5-01be-4471-9ebd-2844792dd65d",
];
const randomLink =
  referralLinks[Math.floor(Math.random() * referralLinks.length)];
const referralLink = document.querySelector<HTMLAnchorElement>("#codebuff")!;

referralLink.href = randomLink;
referralLink.title =
  "Referral link for extra 500 credits / month for both of us 💚";
