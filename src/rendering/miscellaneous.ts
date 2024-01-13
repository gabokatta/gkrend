import buttonSound from "./sound/button.mp3?url";
import logoSound from "./sound/startup.mp3?url";

const buttons = document.querySelectorAll(".btn");
const soundButton = document.querySelector("#sound");
const logoButton = document.querySelector(".logo");
const VOLUME = 0.25;

var audioEnabled = true;
var buttonAudio: HTMLAudioElement | undefined = undefined;
var logoAudio: HTMLAudioElement | undefined = undefined;

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const soundToggle = document.querySelector("#sound");
  soundToggle?.classList.toggle("sound-on", audioEnabled);
  soundToggle?.classList.toggle("sound-off", !audioEnabled);
}

export function initSound() {
  buttonAudio = new Audio(buttonSound);
  logoAudio = new Audio(logoSound);
  buttonAudio.volume = VOLUME;
  logoAudio.volume = VOLUME;

  logoButton?.addEventListener("click", () => {
    if (audioEnabled) {
      logoAudio!.play();
    }
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (audioEnabled) {
        buttonAudio!.currentTime = 0;
        buttonAudio!.play();
      }
    });
  });
}

soundButton?.addEventListener("click", () => toggleAudio());

/* Animations */

const letters = document.querySelectorAll(".letter");
logoButton?.addEventListener("click", () => {
  letters.forEach((letter) => letter.classList.add("letter-animated"));
});

logoButton?.addEventListener("animationend", () => {
  letters.forEach((letter) => letter.classList.remove("letter-animated"));
});
