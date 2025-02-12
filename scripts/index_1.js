//this is a historical index, before changes to boat input - manual instead of automatic
//and round change - multiple turns per round per team

const grid = 24; // Full grid size
const gridSize = grid - 1; // Grid size excluding labels (23 rows/columns)
const quadrantSize = Math.floor(gridSize / 2); // Size of each quadrant, rounded down
const remainder = gridSize % 2; // The remainder to adjust the quadrants if necessary
let numberOfTeams = 2;
let numberOfShips = 2;
let gridLocked = true;
let teamLocked = false;
let gameplay = false;
let gridTable; //global variable to store table
let teamTurn = 0;
let round = 1;
const teamsArray = [];
const ghostshipCoord = [];
let ghostshipHitCount = 0;
let usedTargets = []; // Global array to store used targets

const colors = [
  "#FF5733", // Red-Orange
  "#33FF57", // Green
  "#3357FF", // Blue
  "#F1C40F", // Yellow
  "#8E44AD", // Purple
  "#E74C3C", // Red
  "#1ABC9C", // Turquoise
  "#FF8C00", // Dark Orange
];
const arrayOfBoats = [
  "PTBoat",
  "Submarine",
  "Cruiser",
  "Destroyer",
  "Battleship",
  "AircraftCarrier",
];

function lockGrid() {
  const lockButton = document.getElementById("lockGridButton");
  const gridSizeInput = document.getElementById("grid");
  const gridSizeLabel = document.getElementById("gridSizeLabel");

  lockButton.disabled = true; // Disable the lock button
  gridSizeInput.disabled = true; // Disable the grid size input
  lockButton.style.display = "none"; // Hide the lock button
  gridSizeInput.style.display = "none"; // Hide the grid input
  gridSizeLabel.style.display = "none";

  gridLocked = true;
}

function lockTeams() {
  const lockButton = document.getElementById("lockTeamButton");
  const teamSizeInput = document.getElementById("numberOfTeams");
  const teamSizeLabel = document.getElementById("numberOfTeamsLabel");

  lockButton.disabled = true; // Disable the lock button
  teamSizeInput.disabled = true; // Disable the grid size input
  lockButton.style.display = "none"; // Hide the lock button
  teamSizeInput.style.display = "none"; // Hide the grid input
  teamSizeLabel.style.display = "none";

  teamLocked = true;
  // Generate input fields for team names
  nameTeams(numberOfTeams);
}

function nameTeams(numberOfTeams) {
  if (teamLocked && gridLocked) {
    const container = document.getElementById("nameTeams");
    container.innerHTML = ""; // Clear existing inputs

    const inputs = []; // Store inputs to hide later

    for (let i = 0; i < numberOfTeams; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Team ${i + 1} Name`;
      input.className = "team-name";
      input.id = `teamName${i + 1}`;
      input.style.backgroundColor = colors[i % colors.length]; // Set the background color
      container.appendChild(input);
      inputs.push(input); // Add input to the array
    }

    // Create the finalize button
    const finalizeButton = document.createElement("button");
    finalizeButton.id = "finalizeTeamsButton";
    finalizeButton.textContent = "Finalize Team Names";
    container.appendChild(finalizeButton);

    // Add event listener for the finalize button
    finalizeButton.addEventListener("click", function () {
      const teams = createTeams(numberOfTeams);
      finalizeButton.disabled = true;
      finalizeButton.style.display = "none";

      // Hide the input fields
      inputs.forEach((input) => {
        input.style.display = "none";
      });

      chooseShips(); // Proceed to choose ships
    });
  }
}

function chooseShips() {
  const container = document.getElementById("numberOfShips");
  container.innerHTML = ""; // Clear existing inputs
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
    arrangeBoatsManually(numberOfShips);
  });
}

function createTeams(numberOfTeams) {
  for (let i = 1; i <= numberOfTeams; i++) {
    let team = {
      id: "team" + i,
      name: document.getElementById(`teamName${i}`).value,
      score: 0,
      color: colors[(i - 1) % colors.length],
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
    teamsArray.push(team);
  }
  return teamsArray;
}

//arrangeBoats(numberOfShips)
function arrangeBoats(numberOfShips) {
  //isn't nunmberOfShips global, do I really need to pass it here?
  for (let i = 0; i < numberOfTeams; i++) {
    // Array of boat types
    const boatTypes = arrayOfBoats.slice(0, numberOfShips); // Only use the first 'numberOfShips' types

    for (const boatType of boatTypes) {
      let boatLength = teamsArray[i][boatType].length; // Get the length for the current boat
      let validPlacement = false;

      while (!validPlacement) {
        let row,
          col = 0;
        let direction = coinFlip();

        if (direction === "Horizontal") {
          row = Math.floor(Math.random() * (grid - 1)) + 1;
          col = Math.floor(Math.random() * (grid - boatLength - 1)) + 1;
        } else {
          // Vertical
          row = Math.floor(Math.random() * (grid - boatLength - 1)) + 1;
          col = Math.floor(Math.random() * (grid - 1)) + 1;
        }

        if (!checkForConflict(row, col, boatLength, direction, boatTypes)) {
          validPlacement = true; // Found a valid placement
          if (direction === "Horizontal") {
            for (let j = 0; j < boatLength; j++) {
              changeCellColor(row, col + j, teamsArray[i].color);
              teamsArray[i][boatType].coordinates.push([row, col + j]);
            }
          } else {
            // Vertical
            for (let j = 0; j < boatLength; j++) {
              changeCellColor(row + j, col, teamsArray[i].color);
              teamsArray[i][boatType].coordinates.push([row + j, col]);
            }
          }
        }
      }
    }
  }
  addGhostShip();
  displayTeamFilter();
}

function arrangeBoatsManually(numberOfShips) {
  // Assume the boats are arranged manually
  for (let i = 0; i < numberOfTeams; i++) {
    // Array of boat types
    const boatTypes = arrayOfBoats.slice(0, numberOfShips); // Only use the first 'numberOfShips' types

    for (const boatType of boatTypes) {
      let boatLength = teamsArray[i][boatType].length; // Get the length for the current boat
      let validPlacement = false;

      while (!validPlacement) {
        let row, col, direction;

        // Here you can replace this with manual input, for example using a prompt
        // For now, I will simulate this by just manually setting the values
        // In a real application, you would replace this with actual user input code (UI-based or prompt)

        // Manual row, column, and direction input (for example, prompt or UI selection)
        row = parseInt(prompt(`Enter row for ${boatType} (team ${i + 1}):`)); // Example: ask user for row
        col = parseInt(prompt(`Enter column for ${boatType} (team ${i + 1}):`)); // Example: ask user for column
        direction = prompt(
          `Enter direction for ${boatType} (Horizontal/Vertical):`
        ); // Example: ask user for direction

        // Since we are allowing overlapping, no conflict check is needed
        if (direction === "Horizontal") {
          if (col + boatLength <= grid) {
            // Ensure the boat fits in the grid horizontally
            validPlacement = true;
            // Update the grid
            for (let j = 0; j < boatLength; j++) {
              changeCellColor(row, col + j, teamsArray[i].color);
              teamsArray[i][boatType].coordinates.push([row, col + j]);
            }
          } else {
            alert("The boat doesn't fit horizontally. Please try again.");
          }
        } else if (direction === "Vertical") {
          if (row + boatLength <= grid) {
            // Ensure the boat fits in the grid vertically
            validPlacement = true;
            // Update the grid
            for (let j = 0; j < boatLength; j++) {
              changeCellColor(row + j, col, teamsArray[i].color);
              teamsArray[i][boatType].coordinates.push([row + j, col]);
            }
          } else {
            alert("The boat doesn't fit vertically. Please try again.");
          }
        } else {
          alert("Invalid direction. Please choose Horizontal or Vertical.");
        }
      }
    }
  }

  addGhostShip();
  displayTeamFilter();
}

function addGhostShip() {
  const ghostshipLength = 3;
  let validPlacement = false;
  const boatTypes = arrayOfBoats.slice(0, numberOfShips); // Only use the first 'numberOfShips' types
  while (!validPlacement) {
    let row,
      col = 0;
    let direction = coinFlip();

    if (direction === "Horizontal") {
      row = Math.floor(Math.random() * (grid - 1)) + 1;
      col = Math.floor(Math.random() * (grid - ghostshipLength - 1)) + 1;
    } else {
      // Vertical
      row = Math.floor(Math.random() * (grid - ghostshipLength - 1)) + 1;
      col = Math.floor(Math.random() * (grid - 1)) + 1;
    }

    if (!checkForConflict(row, col, ghostshipLength, direction, boatTypes)) {
      validPlacement = true; // Found a valid placement
      if (direction === "Horizontal") {
        for (let j = 0; j < ghostshipLength; j++) {
          changeCellColor(row, col + j, "white"); // Change to a different color for visibility
          ghostshipCoord.push([row, col + j]);
        }
      } else {
        // Vertical
        for (let j = 0; j < ghostshipLength; j++) {
          changeCellColor(row + j, col, "white");
          ghostshipCoord.push([row + j, col]);
        }
      }
    }
  }
}

function displayTeamFilter() {
  const container = document.getElementById("teamFilter");
  container.innerHTML = ""; // Clear previous content
  // Add a border to the container
  container.style.border = "2px solid #000";

  // Create label for filter
  const selectTeamLabel = document.createElement("label");
  selectTeamLabel.textContent = "Team Filter";
  container.appendChild(selectTeamLabel);

  // Create a select element
  const selectTeam = document.createElement("select");

  // Create and add "All" option
  const allOption = document.createElement("option");
  allOption.value = "all"; // or any value you prefer
  allOption.textContent = "All";
  selectTeam.appendChild(allOption);
  // Create and add "All" option
  const ghostOption = document.createElement("option");
  ghostOption.value = "ghostShip"; // or any value you prefer
  ghostOption.textContent = "Ghost Ship";
  selectTeam.appendChild(ghostOption);

  // Populate the dropdown with teams
  for (let i = 0; i < numberOfTeams; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = teamsArray[i].name;
    selectTeam.appendChild(option);
  }

  // Add an event listener
  selectTeam.addEventListener("change", function () {
    const selectedTeam = this.value;
    if (selectedTeam == "all") {
      addTable();
      const coordinatesDisplay = document.getElementById("shipCoordinates");
      coordinatesDisplay.innerHTML = ""; // Clear previous coordinates
      for (i = 0; i < numberOfTeams; i++) {
        colorSelectedTeam(i);
      }

      ghostshipCoord.forEach((coord) => {
        changeCellColor(coord[0], coord[1], "white"); // Adjust the color for visibility
      });
    } else if (selectedTeam == "ghostShip") {
      const coordinatesDisplay = document.getElementById("shipCoordinates");
      coordinatesDisplay.innerHTML = ""; // Clear previous coordinates
      addTable();
      ghostshipCoord.forEach((coord) => {
        changeCellColor(coord[0], coord[1], "white"); // Adjust the color for visibility
      });
      displayShipCoordinates(selectedTeam);
    } else {
      addTable();
      colorSelectedTeam(selectedTeam);
      displayShipCoordinates(selectedTeam); // Show ship coordinates for selected team
    }
  });
  // Create a display area for ship coordinates
  const coordinatesDisplay = document.createElement("div");
  coordinatesDisplay.id = "shipCoordinates";
  container.appendChild(coordinatesDisplay);

  // Append the select element to the container
  container.appendChild(selectTeam);

  //add a gameplay button
  const gameButton = document.getElementById("gameButton");
  const startGame = document.createElement("button");
  startGame.id = "startGame";
  startGame.textContent = "Begin the Game";
  gameButton.appendChild(startGame);
  gameButton.addEventListener("click", game);
}

function displayShipCoordinates(selectedTeam) {
  const coordinatesDisplay = document.getElementById("shipCoordinates");
  coordinatesDisplay.innerHTML = ""; // Clear previous coordinates
  if (selectedTeam == "ghostShip") {
    const coordinates = ghostshipCoord;
    if (coordinates.length > 0) {
      const coordinatesText = `Ghost Ship: ${coordinates
        .map((coord) => `(${String.fromCharCode(coord[0] + 64)}, ${coord[1]})`)
        .join(", ")}`;
      const paragraph = document.createElement("p");
      paragraph.textContent = coordinatesText; // Set the text content
      coordinatesDisplay.appendChild(paragraph); // Append to the display area
    }
  } else {
    const team = teamsArray[selectedTeam];

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
}

function colorSelectedTeam(selectedTeam) {
  // Get the color of the selected team
  const teamColor = teamsArray[selectedTeam].color;

  // Loop through the boat types for the selected team
  for (const boatType in teamsArray[selectedTeam]) {
    const boat = teamsArray[selectedTeam][boatType];

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

function coinFlip() {
  return Math.random() < 0.5 ? "Horizontal" : "Vertical";
}

function changeCellColor(row, col, color) {
  const cell = gridTable.rows[row].cells[col];
  cell.style.backgroundColor = color;
}

function checkForConflict(row, col, boatLength, direction, boatTypes) {
  for (let i = 0; i < numberOfTeams; i++) {
    for (const boatType of boatTypes) {
      const existingCoordinates = teamsArray[i][boatType].coordinates;

      for (let j = 0; j < boatLength; j++) {
        let currentCoord;

        if (direction === "Horizontal") {
          currentCoord = [row, col + j];
        } else {
          // Vertical
          currentCoord = [row + j, col];
        }

        // Check if the current coordinate is in the existing coordinates
        for (const existingCoord of existingCoordinates) {
          if (
            currentCoord[0] === existingCoord[0] &&
            currentCoord[1] === existingCoord[1]
          ) {
            return true; // Conflict found
          }
        }
      }
    }
  }
  return false; // No conflict found
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
        th.style.backgroundColor = "rgb(169, 169, 169)";
      } else if (i == 0) {
        th.appendChild(document.createTextNode(j));
        tr.appendChild(th);
        th.style.backgroundColor = "rgb(169, 169, 169)";
      } else if (j == 0) {
        letter = String.fromCharCode(i + 64);
        td.appendChild(document.createTextNode(`${letter}`));
        tr.appendChild(td);
        td.style.backgroundColor = "rgb(169, 169, 169)";
      } else {
        td.appendChild(document.createTextNode(`${letter}${j}`));
        tr.appendChild(td);
        td.addEventListener("click", () => {
          alert("yo");
        });
      }
    }
  }

  // Loop through rows and columns to assign classes to cells in quadrants
  for (let i = 1; i <= gridSize; i += quadrantSize + remainder) {
    for (let j = 1; j <= gridSize; j += quadrantSize + remainder) {
      // Calculate quadrant class (either 0, 1, 2, or 3)
      let quadrantClass;
      if (i < quadrantSize + remainder) {
        quadrantClass = j < quadrantSize + remainder ? 0 : 1; // Top-left: 0, Top-right: 1
      } else {
        quadrantClass = j < quadrantSize + remainder ? 2 : 3; // Bottom-left: 2, Bottom-right: 3
      }

      // Iterate through the cells in the quadrant
      for (let x = 0; x < quadrantSize + remainder; x++) {
        for (let y = 0; y < quadrantSize + remainder; y++) {
          // Ensure we're within the bounds of the grid
          if (i + x <= gridSize && j + y <= gridSize) {
            const quadrantCell = gridTable.rows[i + x].cells[j + y];
            if (quadrantCell) {
              // Add the class for the current quadrant
              quadrantCell.classList.add(`quadrant-${quadrantClass}`);
            }
          }
        }
      }
    }
  }

  myTableDiv.appendChild(gridTable); // Append the table to the div
  return gridTable; // Optional: still return it if needed
}

// document.getElementById("grid").addEventListener("change", function () {
//   const selectedValue = parseInt(this.value); // Get the selected value
//   grid = selectedValue + 1;
//   document.getElementById(
//     "selectedGrid"
//   ).textContent = `${selectedValue} x ${selectedValue} board`;

//   // Add the table with the new grid size
//   gridTable = addTable(); // Update the grid table with the new size
// });
document
  .getElementById("numberOfTeams")
  .addEventListener("change", function () {
    const selectedValue = parseInt(this.value); // Get the selected value
    numberOfTeams = selectedValue;
    document.getElementById(
      "selectedNumberOfTeams"
    ).textContent = `${selectedValue} teams`;
  });

gridTable = addTable();

function game() {
  gameplay = true;
  const menu = document.getElementById("menu");
  menu.innerHTML = ""; // Clear previous menu content

  const roundMessage = document.createElement("p");
  roundMessage.textContent = `Round ${round}`;

  addTable(); // Function to add the game table

  const action = document.createElement("p");
  action.textContent = `Team ${teamsArray[teamTurn].name}, pick a target!`;
  menu.appendChild(roundMessage);
  menu.appendChild(action);

  const input = document.createElement("input");
  input.type = "text"; // Set input type to text
  input.maxLength = 3; // Limit input to three characters
  input.placeholder = "Enter target (e.g., A1)";
  menu.appendChild(input);

  const button = document.createElement("button");
  button.textContent = "Fire!";
  menu.appendChild(button);

  // Create fire results div
  const fireResults = document.createElement("div");
  fireResults.id = "fireResults";
  menu.appendChild(fireResults);

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
        analyzeHitOrMiss(target); // Call your function to analyze the hit or miss
        usedTargets.push(target); // Add the target to the used targets array
        action.innerHTML = "";
        action.textContent = `Team ${teamsArray[teamTurn].name}, pick a target!`;

        input.value = ""; // Clear the input after submission

        roundMessage.innterHTML = "";
        roundMessage.textContent = `Round ${round}`;
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

function analyzeHitOrMiss(target) {
  const letter = target.charAt(0);
  const number = parseInt(target.slice(1), 10);
  const row = letter.charCodeAt(0) - "A".charCodeAt(0) + 1;
  const column = number;

  if (row < 1 || row >= grid || column < 1 || column >= grid) {
    alert("Out of range");
  } else {
    let hit = false;
    let sunkMsg = "";

    // Check through each team's ships... Don't forget the ghost ship!!!
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

      // Check if the ghost ship was hit
      if (
        ghostshipCoord.some((coord) => coord[0] === row && coord[1] === column)
      ) {
        hit = true; // Ghost ship hit
        ghostshipHitCount++; // Increment the ghost ship hit count
        sunkMsg =
          ghostshipHitCount >= ghostshipCoord.length
            ? "The Ghost Ship has been sunk!"
            : ""; // Check if the ghost ship is sunk
        break; // Exit the loop after a hit
      }

      if (hit) break; // Break out if hit is found
    }

    // Change cell color based on hit or miss
    const fireResults = document.getElementById("fireResults");
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
    teamTurn < numberOfTeams - 1 ? teamTurn++ : ((teamTurn = 0), round++);
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
  }
  for (i = 0; i < numberOfTeams; i++) {
    const menu = document.getElementById("menu");
    const teamScore = document.createElement("p");
    teamScore.textContent = teamsArray[i].name + ": " + teamsArray[i].score;
    menu.appendChild(teamScore);
  }
}
