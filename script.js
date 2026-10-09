
const msgEl = document.getElementById('msg');

// Generate random number
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const randomNum = getRandomNumber();
console.log('Number:', randomNum);

// Set up speech recognition
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();

// Start recognition and game
recognition.start();

// Capture user speech
function onSpeak(event) {
  const msg = event.results[0][0].transcript;
  console.log(msg);

  writeMessage(msg);
  checkNumber(msg);
}

// Write what user speaks
function writeMessage(msg) {
  msgEl.innerHTML = '';

  const div = document.createElement('div');
  div.textContent = 'You said: ';

  const span = document.createElement('span');
  span.classList.add('box');
  span.textContent = msg;

  msgEl.append(div, span);
}

// Check message against secret number
function checkNumber(msg) {

  // Convert spoken words into numbers
  const wordToNumber = {
    one: 1,
    won: 1,
    two: 2,
    to: 2,
    too: 2,
    three: 3,
    four: 4,
    for: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    ate: 8,
    nine: 9,
    ten: 10,
  };

  msg = msg.toLowerCase().trim();

  if (wordToNumber[msg]) {
    console.log(`adjusting ${msg} to ${wordToNumber[msg]}`);
    msg = wordToNumber[msg];
  }

  const num = Number(msg);

  // Check if spoken content is a valid number
  if (msg === '' || Number.isNaN(num)) {
    const div = document.createElement('div');
    div.textContent = 'That is not a valid number';
    msgEl.append(div);

    return;
  }

  // Check if number is in range
  if (num < 1 || num > 100) {
    const div = document.createElement('div');
    div.textContent = 'Number must be between 1 and 100';
    msgEl.append(div);

    return;
  }

  // Check number and provide feedback
  if (num === randomNum) {
    const h2 = document.createElement('h2');
    h2.textContent = `Congrats! You have guessed the number! It was ${num}`;

    const button = document.createElement('button');
    button.classList.add('play-again');
    button.id = 'play-again';
    button.textContent = 'Play Again';

    // Add listener to Play Again button
    button.addEventListener('click', () => window.location.reload());

    msgEl.append(h2, button);

  } else if (num > randomNum) {
    const div = document.createElement('div');
    div.textContent = 'GO LOWER';
    msgEl.append(div);

  } else {
    const div = document.createElement('div');
    div.textContent = 'GO HIGHER';
    msgEl.append(div);
  }
}

// Listen for spoken results
recognition.addEventListener('result', onSpeak);

// Restart speech recognition when it ends
recognition.addEventListener('end', () => {
  if (!document.getElementById('play-again')) {
    recognition.start();
  }
});
