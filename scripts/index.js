const grid = 24; // Full grid size
const gridSize = grid - 1; // Grid size excluding labels (23 rows/columns)
let numberOfTeams = 0;
let numberOfShips = 2;
let selectMode = false;
let clickedCoordinate = [];
let gameplay,
  turnsCreated = false;
let gridTable; //global variable to store table
let currentTurn = 0;
let round = 1;
const teamsArray = [];
let turnsArray = [];
let usedTargets = []; // Global array to store used targets
let currentTurnIndex = 0;
let currentTeamID = 0;
let currentTeam = [];
const fireResults = document.getElementById("fireResults");
const input = document.getElementById("input");
const action = document.getElementById("action");
const button = document.getElementById("button");

colors = ["Blue", "Black", "Orange", "Yellow", "Green", "Red", "Aqua"];

const arrayOfBoats = [
  "PTBoat",
  "Submarine",
  "Cruiser",
  "Destroyer",
  "Battleship",
  "AircraftCarrier",
];
const arrayOfBoatLengths = [2, 3, 3, 4, 4, 5];

window.onload = function () {
  addTable(); // Call the addTable function when the page is loaded
};

//function to choose the number of ships
function chooseShips() {
  const container = document.getElementById("numberOfShips");
  container.innerHTML = ""; // Clear existing inputs
  display = document.createElement("p");
  display.textContent = "How many ships?";
  container.appendChild(display);
  finalizeButton = document.createElement("button");
  finalizeButton.id = "finalizeShipsButton";
  finalizeButton.textContent = "Finalize Number of Ships";
  container.appendChild(finalizeButton);

  // Create a select element
  const selectElement = document.createElement("select");

  // Populate the dropdown with numbers from 2 to 6
  for (let i = 2; i <= 6; i++) {
    const option = document.createElement("option");
    option.value = i; // Set the value to the number
    option.textContent = i; // Set the displayed text to the number
    selectElement.appendChild(option); // Add option to the select
  }

  // Add an event listener
  selectElement.addEventListener("change", function () {
    numberOfShips = this.value; // Log the selected value
  });

  // Append the select element to the dropdown container
  container.appendChild(selectElement);

  // Add event listener for the finalize button
  finalizeButton.addEventListener("click", function () {
    finalizeButton.disabled = true;
    selectElement.disabled = true;
    finalizeButton.style.display = "none";
    selectElement.style.display = "none";
    // arrangeBoats(numberOfShips);
    //need to add a function to place the boats manually - ensure that hit or miss records hit on multiple boats if they overlap
    container.innerHTML = ""; // Clear existing inputs

    arrangeBoatsManually();
  });
}

function createTeam() {
  numberOfTeams++; // Increment the number of teams
  selectMode = true;
  // Prompt the user to enter a team name
  let teamName = prompt("Enter the name of Team " + numberOfTeams);

  // If the user doesn't enter a name, use a default one
  if (!teamName) {
    teamName = "Team " + numberOfTeams; // Default team name
  }

  // Create a new team object
  let team = {
    id: numberOfTeams,
    name: teamName,
    score: 0,
    numberOfQuestionsRight: 0,
    numberOfTurns: 0,
    questionsRightTotal: 0,
    color: colors[(numberOfTeams - 1) % colors.length],
    PTBoat: {
      coordinates: [],
      length: 2,
      hitCount: 0,
    },
    Submarine: {
      coordinates: [],
      length: 3,
      hitCount: 0,
    },
    Cruiser: {
      coordinates: [],
      length: 3,
      hitCount: 0,
    },
    Destroyer: {
      coordinates: [],
      length: 4,
      hitCount: 0,
    },
    Battleship: {
      coordinates: [],
      length: 4,
      hitCount: 0,
    },
    AircraftCarrier: {
      coordinates: [],
      length: 5,
      hitCount: 0,
    },
  };

  // For each boat, prompt the user for coordinates and store them
  let whichShip = 0;
  while (whichShip < numberOfShips) {
    const boatType = arrayOfBoats[whichShip];
    const boatLength = arrayOfBoatLengths[whichShip];
    let coordinatesArray = [];
    let row,
      col = 0;

    // Prompt for the coordinates of the current boat, replace prompt with click
    const coordinatesInput = prompt(
      `Enter the upper left coordinates for the ${boatType} (e.g., A1, B3, etc.)`
    );

    if (coordinatesInput) {
      // Convert the input into an array of coordinates (assuming comma-separated inputs)
      coordinatesArray = coordinatesInput.split(",").map((coord) => {
        row =
          coord.charAt(0).toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 1; // Convert letter to row
        col = parseInt(coord.slice(1), 10); // Extract column number
        return [row, col]; // Return as an array of [row, col]
      });

      const boatDirection = prompt(
        'Enter "h" for horizontal, "v" for vertical'
      );
      // Store the coordinates in the boat's object
      if (boatDirection == "h") {
        for (i = 1; i < boatLength; i++) {
          coordinatesArray.push([row, col + i]);
        }
      } else if (boatDirection == "v") {
        for (i = 1; i < boatLength; i++) {
          coordinatesArray.push([row + i, col]);
        }
      }
      team[boatType].coordinates = coordinatesArray;
    } else {
      console.error("Invalid coordinates input for " + boatType);
    }

    // Move to the next ship
    whichShip++;
  }

  colorSelectedTeam(team);
  // Push the new team to the teams array
  teamsArray.push(team);

  // Optionally, log the team array for debugging
  console.log(teamsArray);
  selectMode = false;
}

function arrangeBoatsManually() {
  const container = document.getElementById("shipPlacement");
  container.innerHTML = ""; // Clear existing inputs

  // Create and display a message
  let displayMessage = document.createElement("p");
  displayMessage.textContent = "Add team";
  container.appendChild(displayMessage);

  // Create the button
  let addTeamButton = document.createElement("button");
  addTeamButton.textContent = "Create Team"; // Optional: Add text to the button

  // Add event listener for the button's click event
  addTeamButton.addEventListener("click", function () {
    // Create a new team
    createTeam();

    // Clear the container and display updated list of teams
    container.innerHTML = ""; // Clear the previous content
    container.appendChild(displayMessage); // Re-add the message

    // Display the updated list of teams
    for (let i = 0; i < teamsArray.length; i++) {
      let displayTeam = document.createElement("p");
      displayTeam.textContent = teamsArray[i].name;
      container.appendChild(displayTeam);
    }

    // Append the "Create Team" button again after displaying the teams
    container.appendChild(addTeamButton);
  });

  // Append the "Create Team" button initially
  container.appendChild(addTeamButton);

  //Create the button to start the game - user decides when they are done creating teams
  let gameButton = document.getElementById("gameButton");
  let startGameButton = document.createElement("button");
  startGameButton.textContent = "Start the Game";

  //Add event listener for the start game button's click event
  startGameButton.addEventListener("click", () => {
    container.innerHTML = "";
    gameButton.innerHTML = "";
    gameplay = true;
    game();
  });
  gameButton.appendChild(startGameButton);
}

function displayShipCoordinates(selectedTeam) {
  const coordinatesDisplay = document.getElementById("shipCoordinates");
  coordinatesDisplay.innerHTML = ""; // Clear previous coordinates
  const team = teamsArray[selectedTeam];
  console.log(`team in displayShipCoordinates is ${team}`);
  // Loop through each ship type and display its coordinates
  for (const boatType in team) {
    if (
      team.hasOwnProperty(boatType) &&
      Array.isArray(team[boatType].coordinates)
    ) {
      const coordinates = team[boatType].coordinates;

      if (coordinates.length > 0) {
        const coordinatesText = `${boatType}: ${coordinates
          .map(
            (coord) => `(${String.fromCharCode(coord[0] + 64)}, ${coord[1]})`
          )
          .join(", ")}`;
        const paragraph = document.createElement("p");
        paragraph.textContent = coordinatesText; // Set the text content
        coordinatesDisplay.appendChild(paragraph); // Append to the display area
      }
    }
  }
}

function colorSelectedTeam(selectedTeam) {
  console.log(selectedTeam);
  // Get the color of the selected team
  const teamColor = selectedTeam.color;

  // Loop through the boat types for the selected team
  for (const boatType in selectedTeam) {
    const boat = selectedTeam[boatType];

    // Check if coordinates exist and are an array
    if (Array.isArray(boat.coordinates)) {
      const coordinates = boat.coordinates;

      // Loop through the coordinates for each boat
      for (const coord of coordinates) {
        const row = coord[0]; // Get the row
        const col = coord[1]; // Get the column

        // Color the cell
        if (gridTable.rows[row] && gridTable.rows[row].cells[col]) {
          gridTable.rows[row].cells[col].style.backgroundColor = teamColor;
        }
      }
    }
  }
}

function changeCellColor(row, col, color) {
  const cell = gridTable.rows[row].cells[col];
  cell.style.backgroundColor = color;
}

function addTable() {
  let myTableDiv = document.getElementById("myDynamicTable");
  while (myTableDiv.firstChild) {
    myTableDiv.removeChild(myTableDiv.firstChild);
  }
  gridTable = document.createElement("TABLE");
  gridTable.border = "1";
  let tableBody = document.createElement("TBODY");
  gridTable.appendChild(tableBody);

  // Create the table
  for (let i = 0; i < grid; i++) {
    let tr = document.createElement("TR");
    tableBody.appendChild(tr);

    for (let j = 0; j < grid; j++) {
      let td = document.createElement("TD");
      let th = document.createElement("TH");
      let letter = String.fromCharCode(i + 64);

      if (i == 0 && j == 0) {
        th.appendChild(document.createTextNode(""));
        tr.appendChild(th);
        th.style.backgroundColor = "rgb(255, 255, 255)";
      } else if (i == 0) {
        th.appendChild(document.createTextNode(j));
        tr.appendChild(th);
        th.style.backgroundColor = "rgb(255, 255, 255)";
      } else if (j == 0) {
        letter = String.fromCharCode(i + 64);
        td.appendChild(document.createTextNode(`${letter}`));
        tr.appendChild(td);
        td.style.backgroundColor = "rgb(255, 255, 255)";
      } else {
        td.appendChild(document.createTextNode(`${letter}${j}`));
        tr.appendChild(td);
      }
    }
  }

  myTableDiv.appendChild(gridTable); // Append the table to the div
  return gridTable; // Optional: still return it if needed
}

gridTable = addTable();

async function game() {
  // Start the first round and create turns for the first round
  await turnCreator(); // Await turnCreator to fill turnsArray initially

  // Randomly pick a team for the current turn
  currentTurnIndex = Math.floor(Math.random() * turnsArray.length);
  currentTeamID = turnsArray[currentTurnIndex]; // Get the team ID from turnsArray
  currentTeam = teamsArray.find((team) => team.id === currentTeamID);

  const menu = document.getElementById("menu");

  const roundMessage = document.createElement("p");
  roundMessage.textContent = `Round ${round}`;

  addTable(); // Function to add the game table
  action.style = "display:inline";
  action.textContent = `Team ${currentTeam.name}, pick a target!`;

  input.style = "display:inline";
  button.style = "display: inline";
  button.textContent = "Fire!";

  // Add event listener to the button
  button.addEventListener("click", function () {
    const target = input.value.toUpperCase(); // Convert input to uppercase for consistency

    if (target.length >= 2 && target.length <= 3) {
      // Check if target has already been used
      if (usedTargets.includes(target)) {
        alert(
          "This target has already been fired upon. Please choose a different one."
        );
      } else {
        turnsArray.splice(currentTurnIndex, 1);
        analyzeHitOrMiss(target); // Call your function to analyze the hit or miss
        usedTargets.push(target); // Add the target to the used targets array
        if (turnsArray.length > 0) {
          action.innerHTML = "";
          action.textContent = `Team ${currentTeam.name}, pick a target!`;

          input.value = ""; // Clear the input after submission

          roundMessage.innerHTML = "";
          roundMessage.textContent = `Round ${round}`;
        } else {
          fireResults.innerHTML = "";
          action.innerHTML = "";

          roundMessage.innerHTML = "";
        }
      }
    } else {
      alert("Please enter exactly a letter and a number (e.g., A1).");
    }
  });

  // Create some space between buttons
  const spacer = document.createElement("div");
  spacer.style.height = "100px"; // Adjust height for the desired spacing
  menu.appendChild(spacer);

  // Add the game over button
  const gameOverButton = document.createElement("button");
  gameOverButton.textContent = "End the game";
  menu.appendChild(gameOverButton);

  // Add event listener for game end
  gameOverButton.addEventListener("click", function () {
    // Show confirmation dialog
    const userConfirmed = window.confirm(
      "Are you sure you want to end the game?"
    );

    // If the user confirms, proceed with ending the game
    if (userConfirmed) {
      button.disabled = true;
      gameOverButton.disabled = true;
      score(); // Call the score function to finalize the game
    } else {
      // Optionally, you could display a message or log something here if they cancel
      console.log("Game ending cancelled.");
    }
  });
}

function turnCreator() {
  return new Promise((resolve) => {
    const container = document.getElementById("questionsCorrect");
    container.innerHTML = ""; // Clear existing inputs

    const display = document.createElement("p");
    display.textContent = "Enter the number of Questions correct for each team";
    container.appendChild(display);

    for (let i = 0; i < numberOfTeams; i++) {
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = teamsArray[i].name;
      input.className = "team-questions-right";
      input.id = `teamName${i + 1}`;
      input.style.backgroundColor = colors[i % colors.length]; // Set the background color
      container.appendChild(input);

      // Initialize the numberOfQuestionsRight and team's Turns
      teamsArray[i].numberOfQuestionsRight = 0;
      teamsArray[i].numberOfTurns = 0;

      // Handle the input value after the user enters data and updates the input
      input.addEventListener("input", function () {
        // Get the value entered in the input and parse it to an integer
        const number = parseInt(input.value) || 0; // If it's not a valid number, default to 0

        // Update the numberOfQuestionsRight with the entered value
        teamsArray[i].numberOfQuestionsRight = number;
        teamsArray[i].questionsRightTotal += number;

        // Recalculate team's turns based on the updated numberOfQuestionsRight
        teamsArray[i].numberOfTurns = Math.ceil(
          teamsArray[i].numberOfQuestionsRight / 2
        );

        // Add team to turnsArray
        for (let j = 0; j < teamsArray[i].numberOfTurns; j++) {
          turnsArray.push(teamsArray[i].id);
        }

        console.log(
          `Team ${teamsArray[i].name} has ${teamsArray[i].numberOfTurns} turns.`
        );
        console.log(`Here's the turns: ${turnsArray}`);
      });
    }

    // Create the finalize button
    const finalizeButton = document.createElement("button");
    finalizeButton.id = "finalizeTeamsButton";
    finalizeButton.textContent = "Enter";
    container.appendChild(finalizeButton);

    // Add event listener for the finalize button
    finalizeButton.addEventListener("click", function () {
      console.log(teamsArray); // Log the updated teams array with correct data
      finalizeButton.disabled = true;
      finalizeButton.style.display = "none";
      container.innerHTML = ""; // Clear the input container after finalizing
      resolve(); // Resolve the promise to indicate that the user has finished
    });
  });
}

async function analyzeHitOrMiss(target) {
  const letter = target.charAt(0);
  const number = parseInt(target.slice(1), 10);
  const row = letter.charCodeAt(0) - "A".charCodeAt(0) + 1;
  const column = number;

  if (row < 1 || row >= grid || column < 1 || column >= grid) {
    alert("Out of range");
  } else {
    let hit = false;
    let sunkMsg = "";

    // Check through each team's ships...
    for (const team of teamsArray) {
      for (const boatType in team) {
        const coordinates = team[boatType].coordinates;

        // Ensure coordinates is an array before iterating
        if (Array.isArray(coordinates)) {
          for (const coord of coordinates) {
            if (coord[0] === row && coord[1] === column) {
              hit = true; // A hit is found
              team[boatType].hitCount++; // Increment the hit count for the ship
              sunkMsg = checkIfSunk(team, boatType)
                ? `${team.name}'s ${boatType} was sunk!`
                : ""; // Check if the ship is sunk
              break; // Exit the loop after a hit
            }
          }
        }
        if (hit) break; // Break out if hit is found
      }

      if (hit) break; // Break out if hit is found
    }

    // Change cell color based on hit or miss

    fireResults.innerHTML = ""; // Clear previous results
    if (hit) {
      changeCellColor(row, column, "red"); // Color the cell red for a hit
      const message = document.createElement("p");
      message.textContent = `${target} was a HIT!`;
      fireResults.appendChild(message);

      if (sunkMsg) {
        const message2 = document.createElement("p");
        message2.textContent = sunkMsg; // Display the sunk message
        fireResults.appendChild(message2);
      }
    } else {
      changeCellColor(row, column, "blue"); // Color the cell blue for a miss
      const message = document.createElement("p");
      message.textContent = `${target} was a Miss.`;
      fireResults.appendChild(message);
    }

    if (turnsArray.length > 0) {
      currentTurnIndex = Math.floor(Math.random() * turnsArray.length);
      currentTeamID = turnsArray[currentTurnIndex];
      currentTeam = teamsArray.find((team) => team.id === currentTeamID);
    } else {
      console.log(turnsArray.length);
      round++;
      input.style = "display:none";
      action.style = "display:none";
      button.style = "display:none";
      await turnCreator();
      input.innerHTML = "";
      input.style = "display:inline";
      action.style = "display:inline";
      action.textContent = `Team ${currentTeam.name}, pick a target!`;
      button.style = "display:inline";
    }
  }
}

function checkIfSunk(team, boatType) {
  const ship = team[boatType];
  return ship.hitCount >= ship.length;
}

function score() {
  const boatTypes = arrayOfBoats.slice(0, numberOfShips); // Only use the first 'numberOfShips' types
  for (const team of teamsArray) {
    for (const boatType of boatTypes) {
      if (team[boatType].hitCount === 0) {
        team.score = team.score + 25;
      }
      if (
        team[boatType].hitCount > 0 &&
        team[boatType].hitCount < team[boatType].length
      ) {
        team.score = team.score + 7;
      }
    }
    team.score = team.score + team.questionsRightTotal;
  }
  for (i = 0; i < numberOfTeams; i++) {
    const menu = document.getElementById("menu");
    const teamScore = document.createElement("p");
    teamScore.textContent = teamsArray[i].name + ": " + teamsArray[i].score;
    menu.appendChild(teamScore);
  }
}
