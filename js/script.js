// disclosure of chatGPT usage

import * as en from '../lang/messages/en/user.js';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formLabel").innerHTML = en.formLabelText;
  document.getElementById("go").textContent = en.goText;
  document.getElementById("myForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const count = parseInt(document.getElementById("number").value, 10);
    if (isNaN(count) || count < 3 || count > 7) {
      alert("Please enter a valid number between 3 and 7.");
      return;
    }
    const gameController = new GameController(count);
    gameController.start(count);
  });
});

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;
}

// Class 1: MyButton
class MyButton {
  constructor(number) {
    this.number = number;
    this.color = getRandomHexColor();
  }

  createButtonElement() {
    const button = document.createElement("button");
    button.textContent = `${this.number}`;
    button.style.backgroundColor = this.color;
    button.classList.add("myButton");
    button.disabled = true;
    button.id = this.number;
    return button;
  }
}

// Class 2: ButtonAnimator
class ButtonAnimator {
  constructor(buttons) {
    this.buttons = buttons;
  }

  async animate(duration) {
    const buttonWidth = 10; 
    const buttonHeight = 5; 
    const buttonWidthInPx = buttonWidth * (window.innerWidth / 100) + 5;
    const buttonHeightInPx = buttonHeight * (window.innerHeight / 100) + 5;

    for (let i = 0; i < duration; i++) {
      this.buttons.forEach((button) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        button.style.position = "absolute";

        // Ensure buttons stay within bounds
        const maxTop = viewportHeight - buttonHeightInPx;
        const maxLeft = viewportWidth - buttonWidthInPx;

        // Generate random positions within bounds
        const randomTop = Math.random() * maxTop;
        const randomLeft = Math.random() * maxLeft;

        button.style.top = `${randomTop}px`;
        button.style.left = `${randomLeft}px`;
      });

      await this.delay(2000); // Delay between animations
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


// Class 3: GameController
class GameController {
  constructor(totalButtons) {
    this.totalButtons = totalButtons;
    this.currentClick = 0;
    this.buttons = [];
    this.container = document.getElementById("buttonContainer");
    this.messageElement = document.getElementById("message");
    this.clickCounterElement = document.getElementById("clicks");
  }

  async start(count) {
    this.reset();
    this.createButtons();
    this.hideForm();

    await this.delay(1000 * count); 
    const animator = new ButtonAnimator(this.buttons);
    await animator.animate(this.totalButtons);
    this.enableButtons();
  }

  reset() {
    this.container.innerHTML = "";
    this.messageElement.hidden = true;
    this.clickCounterElement.textContent = "0";
    this.currentClick = 0;
  }

  hideForm() {
    document.getElementById("myForm").hidden = true;
  }

  createButtons() {
    for (let i = 1; i <= this.totalButtons; i++) {
      const button = new MyButton(i).createButtonElement();
      this.buttons.push(button);
      this.container.appendChild(button);
    }
  }

  enableButtons() {
    this.buttons.forEach((button) => {
      button.disabled = false;
      button.textContent = "";
      button.addEventListener("click", () => {
        this.handleButtonClick(button);
      });
    });
  }

  handleButtonClick(button) {
    this.currentClick += 1;
    this.clickCounterElement.textContent = this.currentClick;

    if (parseInt(button.id, 10) == this.currentClick) {
      button.textContent = button.id;

      if (this.currentClick == this.totalButtons) {
        this.showMessage(en.correctOrderText, false);
        this.revealAllButtons();
      }
    } else {
      this.showMessage(en.wrongOrderText, true);
      this.revealAllButtons();
    }
  }

  revealAllButtons() {
    this.buttons.forEach((button) => {
      button.textContent = button.id;
      button.disabled = true;
    });
  }

  showMessage(messageText, isError) {
    this.messageElement.textContent = messageText;
    this.messageElement.hidden = false;
    this.messageElement.style.color = isError ? "red" : "green";
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
