import buttonSound from "./button.mp3?url";
const buttons = document.querySelectorAll(".btn");

const VOLUME = 0.25;
var audioEnabled = true;
var audio: HTMLAudioElement | undefined = undefined;

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const soundToggle = document.querySelector("#sound");
  soundToggle!.innerHTML = audioEnabled ? "SOUND" : "NO SOUND"; //to be replaced with alternating buttons/icons
}

export function initSound() {
  audio = new Audio(buttonSound);
  audio.volume = VOLUME;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (audioEnabled) {
        audio!.play();
      }
    });
  });
}

const soundButton = document.querySelector("#sound");
soundButton?.addEventListener("click", () => toggleAudio());
