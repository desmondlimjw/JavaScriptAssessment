// Create global variables and import prompt input from package
const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');
 
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const row = 10;
const col = 10;
const field = [];

// Create Field Class with constructor for the game
class Field {

    // Properties stored in an empty array
    field = [];

    // Create constructor
    constructor () {
        this.field = field;
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
        this.generateField(row, col, 0.2);
    }

    // Create generateField method to generate rows and columns
    generateField(height, width, percentage = 0.1) {
         // Generate random fieldCharacter and holes
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const prob = Math.random();
                if (prob > percentage) 
                {
                    field[y][x] = fieldCharacter; // Place field character in field array at position x, y
                } else {
                    field[y][x] = hole; // Place hole character in field array at position x, y
                };
            }
        }

        // Set "Hat" location
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        }

            // Ensure "Hat" not at starting location
            while (hatLocation.x === 0 && hatLocation.y === 0) {
                hatLocation.x = Math.floor(Math.random() * width);
                hatLocation.y = Math.floor(Math.random() * height);
            }
            field[hatLocation.y][hatLocation.x] = hat;
    
        // Set initial character position as [0],[0]
        this.field[0][0] = pathCharacter;
       
        return field;
    } // End of generateField method

    // Create runGame method 
    runGame() {
        let play = true; // Set boolean 
        while (play) {
            this.print(); // While play is true, run both methods print and askQuestion
            this.askQuestion();

            // Use If Else statements to control state of game
            if (!this.inBounds()) 
            {
                // When the character is not in bound, output “Out of bounds - Game End!” and the game ends
                console.log("Out of bounds - Game End!");
                play = false;
                break;
            } 
            else if (this.dropInHole()) 
                {
                    // When user drops into a hole, output “Sorry, you fell down a hole!” and the game ends (play = false)
                    console.log ("Sorry, you fell down a hole!");
                    play = false;
                    break;
                }
            else if (this.hatFound()) 
                {
                    // When the character gets the hat, output “Congrats, you found your hat!” and and the game ends
                    console.log("Congrats, you found your hat!");
                    play = false; 
                    break;
                }
            // Update game screen with position of pathCharacter
            else {
                this.field[this.locationY][this.locationX] = pathCharacter;
            }           
        }
    } // End of runGame method

    print() {
        clear();
        const displayString = this.field.map (row => {
            return row.join(''); 
        }).join('\n'); 
        console.log(displayString);  
    }

    askQuestion() {
        const answer = prompt('Which way? ').toUpperCase();
        // Use Switch-case to vary character location based on user input
        switch (answer) {
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
                console.log("Enter U, D, L or R")
                this.askQuestion()
                break;
        }
    }

    //Create 3 methods to detect when pathCharacter drops into hole, is inside field, or finds hat. Return respective characters

    inBounds() {
        return (
            this.locationX >= 0 && 
            this.locationY >= 0 && 
            this.locationX < this.field[0].lenth && 
            this.locationY < this.field.length
        );
    }

    dropInHole() {
        return this.field[this.locationX][this.locationY] === hole;
    };

    hatFound() {
        return this.field[this.locationX][this.locationY] === hat;
    };

} //End of Field Class

// Instantiate Field Class to initialise constructor and generate rows and columns from the generateField Method.
const myfield = new Field();
myfield.runGame(); // Call runGame Method to run the game