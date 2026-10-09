
const numberMsg = document.getElementById('numberMsg');
const numberBtn = document.getElementById('numberBtn');

const msgEl = document.getElementById('msg');
const jokeEl = document.getElementById('joke');
const listenBtn = document.getElementById('listenBtn');

// Generate a random number between 1 and 100
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

let randomNum = getRandomNumber();
let numberWon = false;

console.log('Secret Number:', randomNum);

// Set up speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let currentGame = '';
let isListening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  // Number Game button
  numberBtn.addEventListener('click', () => {
    currentGame = 'number';
    startListening();
  });

  // Dad Joke button
  listenBtn.addEventListener('click', () => {
    currentGame = 'joke';
    startListening();
  });

  // Microphone starts listening
  recognition.addEventListener('start', () => {
    isListening = true;

    numberBtn.disabled = true;
    listenBtn.disabled = true;

    if (currentGame === 'number') {
      numberMsg.textContent = 'Listening for a number...';
    } else {
      msgEl.textContent = 'Listening for a dad joke request...';
    }
  });

  // Capture spoken words
  recognition.addEventListener('result', onSpeak);

  // Microphone stops listening
  recognition.addEventListener('end', () => {
    isListening = false;

    numberBtn.disabled = numberWon;
    listenBtn.disabled = false;
  });

  // Handle microphone errors
  recognition.addEventListener('error', (event) => {
    console.error('Speech error:', event.error);

    const message = 'Microphone error: ' + event.error;

    if (currentGame === 'number') {
      numberMsg.textContent = message;
    } else {
      msgEl.textContent = message;
    }
  });

} else {
  numberMsg.textContent =
    'Speech recognition is not supported in this browser.';

  msgEl.textContent =
    'Speech recognition is not supported in this browser.';

  numberBtn.disabled = true;
  listenBtn.disabled = true;
}

// Start microphone
function startListening() {
  if (isListening) {
    return;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    recognition.start();
  } catch (error) {
    console.error('Could not start microphone:', error);
  }
}

// Understand spoken words
function onSpeak(event) {
  const msg = event.results[0][0].transcript;

  console.log('You said:', msg);

  if (currentGame === 'number') {
    writeNumberMessage(msg);
    checkNumber(msg);
  } else if (currentGame === 'joke') {
    msgEl.textContent = 'You said: ' + msg;
    checkCommand(msg);
  }
}

// Display spoken number
function writeNumberMessage(msg) {
  numberMsg.textContent = '';

  const div = document.createElement('div');
  div.textContent = 'You said:';

  const span = document.createElement('span');
  span.classList.add('box');
  span.textContent = msg;

  numberMsg.append(div, span);
}

// Check the guessed number
function checkNumber(msg) {
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
    ten: 10
  };

  const spoken = msg.toLowerCase().trim();

  const num = Object.hasOwn(wordToNumber, spoken)
    ? wordToNumber[spoken]
    : Number(spoken);

  // Invalid number
  if (spoken === '' || !Number.isInteger(num)) {
    const div = document.createElement('div');
    div.textContent = 'That is not a valid number';
    numberMsg.append(div);
    return;
  }

  // Number outside the range
  if (num < 1 || num > 100) {
    const div = document.createElement('div');
    div.textContent = 'Number must be between 1 and 100';
    numberMsg.append(div);
    return;
  }

  // Correct guess
  if (num === randomNum) {
    numberWon = true;
    numberBtn.disabled = true;

    const h2 = document.createElement('h2');
    h2.textContent =
      `Congrats! You guessed the number! It was ${num}`;

    const button = document.createElement('button');
    button.textContent = 'Play Again';
    button.classList.add('play-again');

    button.addEventListener('click', () => {
      randomNum = getRandomNumber();
      numberWon = false;
      numberBtn.disabled = false;

      console.log('New Secret Number:', randomNum);

      numberMsg.textContent =
        'New game started! Click Number Game to guess.';
    });

    numberMsg.append(h2, button);

  } else if (num > randomNum) {
    const div = document.createElement('div');
    div.textContent = 'GO LOWER';
    numberMsg.append(div);

  } else {
    const div = document.createElement('div');
    div.textContent = 'GO HIGHER';
    numberMsg.append(div);
  }
}

// Check the Dad Joke command
function checkCommand(msg) {
  const command = msg.toLowerCase();

  if (
    command.includes('dad joke') ||
    command.includes('tell me a joke')
  ) {
    getDadJoke();
  } else {
    const response =
      'Sorry, I did not understand. Please ask me to tell you a dad joke.';

    jokeEl.textContent = response;
    speak(response);
  }
}

// Get a random dad joke from the API
async function getDadJoke() {
  jokeEl.textContent = 'Finding a dad joke...';

  try {
    const response = await fetch(
      'https://icanhazdadjoke.com/',
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Could not fetch joke');
    }

    const data = await response.json();
    const joke = data.joke;

    jokeEl.textContent = joke;

    // Read the joke aloud
    speak(joke);

  } catch (error) {
    console.error(error);

    const response =
      'Sorry, I could not get a dad joke right now.';

    jokeEl.textContent = response;
    speak(response);
  }
}

// Make the assistant speak
function speak(text) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = 'en-US';
  speech.rate = 0.9;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}