let canvas;
let ctx;
let score = 0;
let gameOver = true;
let roundLost = 0;
let history = [];
let jerryCheese = 0;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;


let bgReady, jerryReady, cheeseReady, tomReady;
let bgImage, jerryImage, cheeseImage, tomImage;

let startTime = 0; // captures the time right now
let SECONDS_PER_ROUND = 30; // super important variables should be empathized by upper case
let elapsedTime = 0;

function timeOut() {
  clearInterval(SECONDS_PER_ROUND);
}

function JloadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.jpg";
  jerryImage = new Image();
  jerryImage.onload = function () {
    // show the jerry image
    jerryReady = true;
  };
  jerryImage.src = "images/jerryJ.png";

  cheeseImage = new Image();
  cheeseImage.onload = function () {
    // show the cheese image
    cheeseReady = true;
  };
  cheeseImage.src = "images/cheeseJ.png";

  tomImage = new Image();
  tomImage.onload = function () {
    // show the tom image
    tomReady = true;
  };
  tomImage.src = "images/tomJ.png";


  gameOver = false
}

/** 
 * Setting up our characters.
 * 
 * Note that jerryX represents the X position of our jerry.
 * jerryY represents the Y position.
 * We'll need these values to know where to "draw" the jerry.
 * 
 * The same applies to the cheese.
 */
// if con for Jerry
let jerryX = canvas.width / 2;
let jerryY = canvas.height / 2;

let cheeseX = Math.round(Math.random() * (canvas.width - 100));
let cheeseY = Math.round(Math.random() * (canvas.height - 100));

let tomX = Math.round(Math.random() * (canvas.width - 100));
let tomY = Math.round(Math.random() * (canvas.height - 100));

let cheeseDirectionX = 1;
let cheeseDirectionY = 1;

let tomDirectionX = 1;
let tomDirectionY = 1;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the cheese has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let Jupdate = function () {
  // Update the time.


  if (SECONDS_PER_ROUND - elapsedTime <= 0) {
    gameOver = true;
    return;
  }

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) { // Player is holding up key
    jerryY -= 7;
  }
  if (40 in keysDown) { // Player is holding down key
    jerryY += 7;
  }
  if (37 in keysDown) { // Player is holding left key
    jerryX -= 7;
  }
  if (39 in keysDown) { // Player is holding right key
    jerryX += 7;
  }

  //cheese bounces back
  cheeseX += cheeseDirectionX * 2;
  cheeseY += cheeseDirectionY * 2;

  if (cheeseX > canvas.width - 50 || cheeseX < 0) {
    cheeseDirectionX = -cheeseDirectionX;
  }

  if (cheeseY > canvas.height - 50 || cheeseY < 0) {
    cheeseDirectionY = -cheeseDirectionY;
  }

  //tom bounces back
  tomX += tomDirectionX * 3;
  tomY += tomDirectionY * 3;

  if (tomX > canvas.width - 50 || tomX < 0) {
    tomDirectionX = -tomDirectionX;
  }

  if (tomY > canvas.height - 50 || tomY < 0) {
    tomDirectionY = -tomDirectionY;
  }


  // Check if jerry and cheese collided. Our images
  // are about 32 pixels big.
  if (
    jerryX <= (cheeseX + 32)
    && cheeseX <= (jerryX + 32)
    && jerryY <= (cheeseY + 32)
    && cheeseY <= (jerryY + 32)
  ) {
    // Pick a new location for the cheese.
    // Note: Change this to place the cheese at a new, random location.
    cheeseX = Math.random() * (canvas.width - 100);
    cheeseY = Math.random() * (canvas.height - 100);
    score = score + 1;
    document.getElementById("total-score").innerHTML = `${score}`

  }

  //if jerry collided tom.
  if (
    jerryX <= (tomX + 20)
    && tomX <= (jerryX + 20)
    && jerryY <= (tomY + 20)
    && tomY <= (jerryY + 20)
  ) {
    // Pick a new location for the tom.
    // Note: Change this to place the tom at a new, random location.
    tomX = Math.random() * (canvas.width - 100);
    tomY = Math.random() * (canvas.height - 100);
    roundLost++
    document.getElementById("round-lost").innerHTML = `${roundLost}`
    alert("Jerry got caught. Press enter to restart ;)");
    resetB();
  }

  // keep jerry inside the box
  if (jerryX < 0) {
    jerryX = canvas.width - 32
  }

  if (jerryY <= 0) {
    jerryY = canvas.height - 32
  }

  if (jerryX > canvas.width - 32) {
    jerryX = 0
  }

  if (jerryY > canvas.height - 32) {
    jerryY = 0
  }

}




/**
 * This function, render, runs as often as possible.
 */
var Jrender = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (jerryReady) {
    ctx.drawImage(jerryImage, jerryX, jerryY);
  }
  if (cheeseReady) {
    ctx.drawImage(cheeseImage, cheeseX, cheeseY);
  }

  if (tomReady) {
    ctx.drawImage(tomImage, tomX, tomY);
  }

  if (gameOver == true) {
    ctx.fillText(`Game Over! `, 20, 150);
    // history.push(`${score}`)
  }

  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);

};

//User inputs name
function closeForm(element) {
  document.getElementById(element).style.display = "none";
}

function uInputName() {
  let userInputName = document.getElementById("inputName").value;
  let playerName = document.getElementById("playerName");

  if (userInputName === "") {
    playerName.innerHTML = `Please type your name`;
    return;
  }

  let player = document.getElementById("playerName");
  player.innerHTML = `Hello  ${userInputName} `
  closeForm("myForm");
  document.getElementById("startButton").style.display = "";
}

function submit() {
  uInputName();
}


/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our jerry and cheese)
 * render (based on the state of our game, draw the right things)
 */
var Jmain = function () {
  Jupdate();
  Jrender();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(Jmain);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
//test
function startB() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("chaB").style.display = "flex";
}


// backup
let tomB = document.getElementById("tomB")
let jerryB = document.getElementById("jerryB")

function characterT() {
    tomX = canvas.width / 2;
    tomY = canvas.height / 2;

    jerryX = Math.round(Math.random() * (canvas.width - 100));
    jerryY = Math.round(Math.random() * (canvas.height - 100));

    cheeseX = Math.round(Math.random() * (canvas.width - 100));
    cheeseY = Math.round(Math.random() * (canvas.height - 100));

    jerryDirectionX = 1;
    jerryDirectionY = 1;

    cheeseDirectionX = 1;
    cheeseDirectionY = 1;
    startTime = Date.now();
    TloadImages();
    setupKeyboardListeners();
    Tmain();
    document.getElementById("tomB").style.display = "none";
    document.getElementById("jerryB").style.display = "none";
    document.getElementById("resetButton").style.display = "";
    document.getElementById("canvas").style.display = "block";
  } 
function characterJ() {
  startTime = Date.now();
  JloadImages();
  setupKeyboardListeners();
  Jmain();
document.getElementById("tomB").style.display = "none";
document.getElementById("jerryB").style.display = "none";
document.getElementById("resetButton").style.display = "";
document.getElementById("canvas").style.display = "block";
console.log("jerryB")
}


// Reset Button
function resetB() {
  history.push(`${score}`)
  if (history.length > 0) {
    console.log(history)
    document.getElementById("highest-score").innerHTML = `${Math.max(...history)}`

  };
  document.getElementById("high-score").innerHTML = `${history}`;
  score = 0;
  elapsedTime = 0;
  jerryX = canvas.width / 2;
  jerryY = canvas.height / 2;
  cheeseX = 100;
  cheeseY = 100;
  gameOver = false;
  startTime = Date.now();
  keysDown = {};


}

// enter name

function setupListeners() {
  const node = document.getElementById("inputName");
  node.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      submit();
    }
  });
}

setupListeners()


// play as Tom

function TloadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/background.jpg";
  tomImage = new Image();
  tomImage.onload = function () {

    tomReady = true;
  };
  tomImage.src = "images/tom.png";

  jerryImage = new Image();
  jerryImage.onload = function () {

    jerryReady = true;
  };
  jerryImage.src = "images/jerry.png";

  cheeseImage = new Image();
  cheeseImage.onload = function () {

    cheeseReady = true;
  };
  cheeseImage.src = "images/cheese.png";


  gameOver = false
}

let Tupdate = function () {
  // Update the time.


  if (SECONDS_PER_ROUND - elapsedTime <= 0) {
    gameOver = true;
    return;
  }

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) { // Player is holding up key
    tomY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    tomY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    tomX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    tomX += 5;
  }


  jerryX += jerryDirectionX * 4;
  jerryY += jerryDirectionY * 4;

  if (jerryX > canvas.width - 50 || jerryX < 0) {
    jerryDirectionX = -jerryDirectionX;
  }

  if (jerryY > canvas.height - 50 || jerryY < 0) {
    jerryDirectionY = -jerryDirectionY;
  }


  if (
    tomX <= (jerryX + 32)
    && jerryX <= (tomX + 32)
    && tomY <= (jerryY + 32)
    && jerryY <= (tomY + 32)
  ) {

    jerryX = Math.random() * (canvas.width - 100);
    jerryY = Math.random() * (canvas.height - 100);
    score = score + 1;
    document.getElementById("total-score").innerHTML = `${score}`

  }

  if (
    jerryX <= (cheeseX + 20)
    && cheeseX <= (jerryX + 20)
    && jerryY <= (cheeseY + 20)
    && cheeseY <= (jerryY + 20)
  ) {

    cheeseX = Math.random() * (canvas.width - 100);
    cheeseY = Math.random() * (canvas.height - 100);
    jerryCheese++
    if (jerryCheese == 3) {
      roundLost++
      document.getElementById("round-lost").innerHTML = `${roundLost}`
      alert("Jerry has stolen too much cheeses. Press enter to restart ;)");
      resetB();
    }
  }


  if (tomX < 0) {
    tomX = canvas.width - 32
  }

  if (tomY <= 0) {
    tomY = canvas.height - 32
  }

  if (tomX > canvas.width - 32) {
    tomX = 0
  }

  if (tomY > canvas.height - 32) {
    tomY = 0
  }

}

var Trender = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (tomReady) {
    ctx.drawImage(tomImage, tomX, tomY);
  }
  if (jerryReady) {
    ctx.drawImage(jerryImage, jerryX, jerryY);
  }

  if (cheeseReady) {
    ctx.drawImage(cheeseImage, cheeseX, cheeseY);
  }

  if (gameOver == true) {
    ctx.fillText(`Game Over! `, 20, 150);

  }

  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);

};


var Tmain = function () {
  Tupdate();
  Trender();

  requestAnimationFrame(Tmain);
};