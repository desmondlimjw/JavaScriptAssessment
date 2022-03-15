// Create global variables and import prompt input from package
const prompt = require("prompt-sync")({ sigint: true });
const clear = require("clear-screen");

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const row = 10;
const col = 10;

// Create Field Class with constructor for the game
class Field {
  // Properties stored in an empty array
  field = [];

  // Create constructor
  constructor() {
    // Current location of character (0, 0)
    this.locationX = 0;
    this.locationY = 0;

    /* Create 2D array to hold the game field
        [ [*], [], [], [], [], [], []...  ]
        */
    for (let a = 0; a < col; a++) {
      this.field[a] = [];
    }

    // Use generateField method to generate rows. Set probability of generating a hole to 20%
    // If random number > 0.2, I will generate a field. If random number < 0.2, I will generate a hole.
    this.generateField(row, col, 0.2); //passing 0.2 as the argument to the generateField method
  }

  isInBounds() {
    //return true or false
    //check if location Y is within 0 and width-1 (9)
    //check if location X i within 0 and height-1(9)
    if (
      this.locationY >= 0 &&
      this.locationY < col &&
      this.locationX >= 0 &&
      this.locationX < row
    ) {
      return true;
    }
    return false;
  }

  // Create runGame method
  runGame() {
    let play = true; // Set boolean
    while (play) {
      this.print(); // While play is true, run both methods print and askQuestion
      this.askQuestion();

      // Use If Else statements to control state of game
      if (!this.isInBounds()) {
        // When the character is not in bound, output “Out of bounds - Game End!” and the game ends
        console.log("Out of bounds - Game End!");
        play = false;
      } else {
        if (this.field[this.locationY][this.locationX] == hole) {
          // When user drops into a hole, output “Sorry, you fell down a hole!” and the game ends (play = false)
          console.log("Sorry, you fell down a hole!");
          play = false;
        } else if (this.field[this.locationY][this.locationX] == hat) {
          // When the character gets the hat, output “Congrats, you found your hat!” and and the game ends
          console.log("Congrats, you found your hat!");
          play = false;
        }
        //Update game screen with position of pathCharacter
        this.field[this.locationY][this.locationX] = pathCharacter;
      }
    }
  } // End of runGame method

  // Create generateField method to generate rows and columns
  // If there is no argument passed in from the calling method, the default value of percentage is 0.1
  generateField(height, width, percentage = 0.1) {
    // Generate random fieldCharacter and holes
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        //Generate random holes
        const prob = Math.random();

        //Step 1: random the hole Char onto the field. random number that is generated to compare to the percentage that you have set

        //Ternary operator
        this.field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }

    // Set "Hat" location randomly. Two Math.random() - to populate x & y position
    let hatX = Math.floor(Math.random() * width); //0 to 9
    let hatY = Math.floor(Math.random() * height);

    //What if hatX and hatY position is 0,0 - it will replace the character with the hat
    //check if hat will replace character or not - Char position is 0,0
    //if-else - only check once

    // Ensure "Hat" not at starting location
    do {
      hatX = Math.floor(Math.random() * width);
      hatY = Math.floor(Math.random() * height);
    } while (hatX == 0 && hatY == 0);

    //set position of hat
    this.field[hatY][hatX] = hat;

    // Set initial character position as [0],[0]
    this.field[0][0] = pathCharacter;

    // return this.field;
  } // End of generateField method

  print() {
    clear();
    const displayString = this.field
      .map((row) => {
        return row.join("");
      })
      .join("\n");
    console.log(displayString);
  }

  askQuestion() {
    const answer = prompt("Which way? ").toUpperCase();
    // Use Switch-case to vary character location based on user input
    switch (answer) {
      //x populate the columns 10
      //y populate the rows 10
      //move one step to the right = x + 1
      //move one step to the left = x - 1
      //move one step up = y - 1
      //move one step down = y + 1
      case "U":
        this.locationY -= 1; // Move up one row
        break;
      case "D":
        this.locationY += 1; // Move down one row
        break;
      case "L":
        this.locationX -= 1; // Move left one index
        break;
      case "R":
        this.locationX += 1; // Move right one index
        break;
      default:
        console.log("Enter U, D, L or R");
        this.askQuestion();
    }
  }
} //End of Field Class

// Instantiate Field Class to initialise constructor and generate rows and columns from the generateField Method.
const myfield = new Field();
myfield.runGame(); // Call runGame Method to run the game
