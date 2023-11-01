import './style.css';

const CHARS = {
  uppercases: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercases: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '~`!@#$%^&*()_-+={[}]:;"\'<,>.?/|\\',
  // Latin extended additional (from wikipedia)
  extendedLatin: String.fromCharCode(...range(0x1e00, 0x1eff + 1)),
};

interface GenerateOptions {
  uppercases: boolean;
  lowercases: boolean;
  numbers: boolean;
  symbols: boolean;
  extendedLatin: boolean;
  length: number;
}

function range(start: number, stop: number) {
  return Array.from(
    { length: Math.floor(Math.abs(stop - start)) },
    (_, index) => {
      return start + index;
    }
  );
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function suffle<T>(arr: T[]): T[] {
  for (let i = 0; i < arr.length; i++) {
    arr.push(arr.splice(randomInt(arr.length), 1)[0]);
  }
  return arr;
}

function generate(options: GenerateOptions) {
  const length = options.length || 8;

  const allChars: [string, string][] = [];

  if (options.uppercases) {
    allChars.push([CHARS.uppercases, 'uppercases']);
  }
  if (options.lowercases) {
    allChars.push([CHARS.lowercases, 'lowercases']);
  }
  if (options.numbers) {
    allChars.push([CHARS.numbers, 'numbers']);
  }
  if (options.symbols) {
    allChars.push([CHARS.symbols, 'symbols']);
  }
  if (options.extendedLatin) {
    allChars.push([CHARS.extendedLatin, 'extended-latin']);
  }

  let result: [string, string][] = [];

  // Make sure to include all the different characters;
  if (length >= allChars.length) {
    for (let i = 0, l = Math.floor(length / allChars.length); i < l; i++) {
      for (let chars of allChars) {
        result.push([chars[0][randomInt(chars[0].length)], chars[1]]);
      }
    }
    for (let i = 0, l = length % allChars.length; i < l; i++) {
      let chars = allChars[randomInt(allChars.length)];
      result.push([chars[0][randomInt(chars[0].length)], chars[1]]);
    }
  } else {
    for (let i = 0; i < length; i++) {
      let chars = allChars[randomInt(allChars.length)];
      result.push([chars[0][randomInt(chars[0].length)], chars[1]]);
    }
  }

  return suffle(result);
}

//

const resultOutput = document.getElementById('result-output')!;
const clipboardBtn = document.getElementById('clipboard-btn')!;
const lengthRange = document.getElementById('length-range')!;
const form = document.querySelector('form')!;

let generatedPassword: [string, string][] = [];

const startGenerate = (event?: Event) => {
  event?.preventDefault();

  const data = new FormData(form);

  const result = generate({
    uppercases: data.get('uppercases') == 'on',
    lowercases: data.get('lowercases') == 'on',
    numbers: data.get('numbers') == 'on',
    symbols: data.get('symbols') == 'on',
    extendedLatin: data.get('extended-latin') == 'on',
    length: +(data.get('length-range') || '8'),
  });

  resultOutput.innerHTML = '';

  result.forEach((char) => {
    const el = document.createElement('span');
    el.style.color = `var(--${char[1]}-color)`;
    el.textContent = char[0];
    resultOutput.append(el);
  });

  generatedPassword = result;
};

startGenerate();

// Generate when a form is submit or value of a input fields is changed.
form.addEventListener('change', startGenerate);
form.addEventListener('submit', startGenerate);

lengthRange.addEventListener("input", () => {
  startGenerate();
});


clipboardBtn.addEventListener('click', () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(generatedPassword.map((a) => a[0]).join(''));
  }
});