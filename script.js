
const msgEl = document.getElementById('msg');
const jokeEl = document.getElementById('joke');
const listenBtn = document.getElementById('listenBtn');

// Set up speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  // Start listening when button is clicked
  listenBtn.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    recognition.start();
  });

  // Capture what the user says
  recognition.addEventListener('result', onSpeak);

  recognition.addEventListener('start', () => {
    listenBtn.disabled = true;
    msgEl.textContent = 'Listening...';
  });

  recognition.addEventListener('end', () => {
    listenBtn.disabled = false;
  });

  recognition.addEventListener('error', (event) => {
    msgEl.textContent = 'Microphone error: ' + event.error;
    listenBtn.disabled = false;
  });

} else {
  msgEl.textContent = 'Speech recognition is not supported in this browser.';
  listenBtn.disabled = true;
}

// Understand what the user says
function onSpeak(event) {
  const msg = event.results[0][0].transcript;

  console.log('You said:', msg);
  msgEl.textContent = 'You said: ' + msg;

  checkCommand(msg);
}

// Check the spoken command
function checkCommand(msg) {
  const command = msg.toLowerCase();

  if (
    command.includes('dad joke') ||
    command.includes('tell me a joke')
  ) {
    getDadJoke();
  } else {
    const response = 'Sorry, I did not understand. Please ask me to tell you a dad joke.';

    jokeEl.textContent = response;
    speak(response);
  }
}

// Get a dad joke from the API
async function getDadJoke() {
  jokeEl.textContent = 'Finding a dad joke...';

  try {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json'
      }
    });

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

    const response = 'Sorry, I could not get a dad joke right now.';

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
