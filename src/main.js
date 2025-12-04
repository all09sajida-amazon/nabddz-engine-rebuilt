import { detectMood } from './mood-detector-v2.js';
import { injectMetadata } from './Metadata_Injector.js';

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

window.addEventListener('scroll', debounce(() => {
  console.log('Scroll event triggered');
}, 100));

const userInput = document.querySelector('#user-input');
userInput.addEventListener('input', debounce((e) => {
  const mood = detectMood(e.target.value);
  console.log('Detected mood:', mood);
  injectMetadata({ mood });
}, 300));
