let grid = 21;
let numberOfTeams = 2;
let gridLocked,
  teamLocked = false;
let gridTable; //global variable to store table

const teamsArray = [];
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

  lockButton.disabled = true; // Disable the lock button
  gridSizeInput.disabled = true; // Disable the grid size input

  gridLocked = true;
  nameTeams();
}

function lockTeams() {
  const lockButton = document.getElementById("lockTeamButton");
  const teamSizeInput = document.getElementById("numberOfTeams");

  lockButton.disabled = true; // Disable the lock button
  teamSizeInput.disabled = true; // Disable the grid size input

  // Optional: Show a message or take further actions after locking
  teamLocked = true;
  nameTeams();

  // Generate input fields for team names
  nameTeams(numberOfTeams);
}

function nameTeams(numberofTeams) {
  if (teamLocked && gridLocked) {
    const container = document.getElementById("nameTeams");
    container.innerHTML = ""; // Clear existing inputs

    for (let i = 0; i < numberOfTeams; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Team ${i + 1} Name`;
      input.className = "team-name";
      input.id = `teamName${i + 1}`;
      input.style.backgroundColor = colors[i % colors.length]; // Set the background color
      container.appendChild(input);
    }
    // Create the finalize button only if it doesn't exist

    finalizeButton = document.createElement("button");
    finalizeButton.id = "finalizeTeamsButton";
    finalizeButton.textContent = "Finalize Team Names";
    container.appendChild(finalizeButton);

    // Add event listener for the finalize button
    finalizeButton.addEventListener("click", function () {
      const teams = createTeams(numberOfTeams);
      console.log(teams); // Now teams will have names populated from input fields
      finalizeButton.disabled = true;
      arrangeBoats();
    });
  }
}

function createTeams(numberOfTeams) {
  for (i = 1; i <= numberOfTeams; i++) {
    let team = {
      id: "team" + i,
      name: document.getElementById(`teamName${i}`).value, // Get the name from the input
      color: colors[(i - 1) % colors.length],
      PTBoat: {
        coordinates: [],
        length: 2,
      },
      Submarine: {
        coordinates: [],
        length: 3,
      },
      Cruiser: {
        coordinates: [],
        length: 3,
      },
      Destroyer: {
        coordinates: [],
        length: 4,
      },
      Battleship: {
        coordinates: [],
        length: 4,
      },
      AircraftCarrier: {
        coordinates: [],
        length: 5,
      },
    };
    teamsArray.push(team);
  }
  return teamsArray;
}

function arrangeBoats() {
  for (let i = 0; i < numberOfTeams; i++) {
    // Array of boat types
    const boatTypes = ["PTBoat", "Submarine", "Cruiser"];

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
        console.log(
          `Team ${
            i + 1
          }: Placed ${boatType} at direction: ${direction}, column: ${col}, row: ${row}`
        );
      }

      console.log(teamsArray[i]);
    }
  }
}

//add length number of coordinates
//add a for loop of boats
//push coordinates to team object
//check if coordinates clash..(while loop)
//check quadrant limitation...(same while loop)

function coinFlip() {
  return Math.random() < 0.5 ? "Horizontal" : "Vertical";
}

function changeCellColor(row, col, color) {
  console.log(row, col, color);
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
            console.log("conflict found");
            return true; // Conflict found
          }
        }
      }
    }
  }

  console.log("no conflict found");
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
        th.style.backgroundColor = "rgb(152, 37, 156)";
      } else if (i == 0) {
        th.appendChild(document.createTextNode(j));
        tr.appendChild(th);
        th.style.backgroundColor = "rgb(152, 37, 156)";
      } else if (j == 0) {
        letter = String.fromCharCode(i + 64);
        td.appendChild(document.createTextNode(`${letter}`));
        tr.appendChild(td);
        td.style.backgroundColor = "rgb(152, 37, 156)";
      } else {
        td.appendChild(document.createTextNode(`${letter}${j}`));
        tr.appendChild(td);
        td.addEventListener("click", () => {
          alert("yo");
        });
      }
    }
  }

  // Apply background colors for each 5x5 quadrant
  for (let i = 1; i < grid - 1; i += (grid - 1) / 2) {
    for (let j = 1; j < grid - 1; j += (grid - 1) / 2) {
      const quadrantClass = (i / ((grid - 1) / 2)) * 2 + j / ((grid - 1) / 2); // Determine quadrant number
      for (let x = 0; x < (grid - 1) / 2; x++) {
        for (let y = 0; y < (grid - 1) / 2; y++) {
          if (i + x < grid && j + y < grid) {
            const quadrantCell = gridTable.rows[i + x].cells[j + y];
            if (quadrantCell) {
              quadrantCell.classList.add(
                `quadrant-${Math.ceil(quadrantClass)}`
              );
            }
          }
        }
      }
    }
  }

  myTableDiv.appendChild(gridTable); // Append the table to the div
  return gridTable; // Optional: still return it if needed
}

document.getElementById("grid").addEventListener("change", function () {
  const selectedValue = parseInt(this.value); // Get the selected value
  grid = selectedValue + 1;
  document.getElementById(
    "selectedGrid"
  ).textContent = `Selected: ${selectedValue}`;

  // Add the table with the new grid size
  gridTable = addTable(); // Update the grid table with the new size
});
document
  .getElementById("numberOfTeams")
  .addEventListener("change", function () {
    const selectedValue = parseInt(this.value); // Get the selected value
    numberOfTeams = selectedValue;
    document.getElementById(
      "selectedNumberOfTeams"
    ).textContent = `Selected: ${selectedValue}`;
  });

gridTable = addTable();
