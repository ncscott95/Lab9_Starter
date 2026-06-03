TrackJS.track('Testing TrackJS!');

let form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let output = document.querySelector('output');
  let firstNum = document.querySelector('#first-num').value;
  let secondNum = document.querySelector('#second-num').value;
  let operator = document.querySelector('#operator').value;
  output.innerHTML = eval(`${firstNum} ${operator} ${secondNum}`);
});

let orderDemoBtn = document.querySelector('#order-demo-btn');
let customErrorDemoBtn = document.querySelector('#custom-error-demo-btn');
let errorBtns = document.querySelector('#error-btns');
let orderRequestInput = document.querySelector('#order-request-num');
let orderAvailableInput = document.querySelector('#order-available-num');
let orderDemoOutput = document.querySelector('#order-demo-output');

class InventoryValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'InventoryValidationError';
    this.details = details;
  }
}

function runOrderValidationDemo() {
  let requestedQty = Number(orderRequestInput.value);
  let availableQty = Number(orderAvailableInput.value);

  try {
    if (!Number.isFinite(requestedQty) || !Number.isFinite(availableQty)) {
      throw new Error('Enter two numbers to validate the inventory check');
    }

    if (!Number.isInteger(requestedQty) || !Number.isInteger(availableQty)) {
      throw new TypeError('Inventory counts must be whole numbers');
    }

    if (requestedQty <= 0) {
      throw new RangeError('Requested quantity must be greater than zero');
    }

    if (requestedQty > availableQty) {
      throw new Error(`Cannot fulfill order: requested ${requestedQty}, only ${availableQty} available`);
    }

    orderDemoOutput.innerHTML = `Order approved: ${requestedQty} items reserved`;
    console.log('Order validation passed');
  } catch (error) {
    orderDemoOutput.innerHTML = 'Order validation failed. Check the console.';
    console.error('Order validation failed:', error.message);
  } finally {
    console.log('Finished order validation attempt');
  }
}

function runCustomErrorDemo() {
  let requestedQty = Number(orderRequestInput.value);
  let availableQty = Number(orderAvailableInput.value);

  try {
    if (!Number.isFinite(requestedQty) || !Number.isFinite(availableQty)) {
      throw new InventoryValidationError('Enter two numbers to validate the custom error example', {
        requestedQty,
        availableQty,
      });
    }

    if (requestedQty > availableQty) {
      throw new InventoryValidationError(
        `Only ${availableQty} units are available for the requested ${requestedQty}`,
        { requestedQty, availableQty }
      );
    }

    orderDemoOutput.innerHTML = `Custom order approved: ${requestedQty} items reserved`;
    console.log('Custom error demo passed');
  } catch (error) {
    if (error instanceof InventoryValidationError) {
      orderDemoOutput.innerHTML = 'Custom error demo failed. Check the console.';
      console.error(`${error.name}: ${error.message}`, error.details);
    } else {
      throw error;
    }
  } finally {
    console.log('Finished custom error demo attempt');
  }
}

window.onerror = (message) => {
  console.log('Global error caught:', message);
  return true;
};

let buttonHandlers = {
  'Console Log': () => console.log('Console Log Demo'),
  'Console Error': () => console.error('Console Error Demo'),
  'Console Count': () => console.count('Count Button'),
  'Console Warn': () => console.warn('Console Warn Demo'),
  'Console Assert': () => {
    console.assert(false, { number: 1, errorMsg: 'the number does not equal 0' });
  },
  'Console Clear': () => console.clear(),
  'Console Dir': () => console.dir(errorBtns),
  'Console dirxml': () => console.dirxml(errorBtns),
  'Console Group Start': () => console.group('Console Group'),
  'Console Group End': () => console.groupEnd(),
  'Console Table': () => console.table(['table', 'demo', 'console', 'table']),
  'Start Timer': () => console.time('Console Timer'),
  'End Timer': () => console.timeEnd('Console Timer'),
  'Console Trace': () => deep(),
  'Trigger a Global Error': () => {
    setTimeout(() => {
      throw new Error('Global error demo');
    }, 0);
  }
};

function deep() { deeper(); }
function deeper() { deepest(); }
function deepest() { console.trace('Console Trace Demo'); }

errorBtns.addEventListener('click', event => {
  let button = event.target.closest('button');

  if (!button || !errorBtns.contains(button)) {
    return;
  }

  let handler = buttonHandlers[button.textContent.trim()];

  if (handler) {
    handler();
  }
});

orderDemoBtn.addEventListener('click', runOrderValidationDemo);
customErrorDemoBtn.addEventListener('click', runCustomErrorDemo);
