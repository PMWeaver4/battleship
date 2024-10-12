let grid = 21;
let numberOfTeams = 2;
let gridLocked,
  teamLocked = false;

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F1C40F",
  "#8E44AD",
  "#E74C3C",
];

function lockGrid() {
  const lockButton = document.getElementById("lockGridButton");
  const gridSizeInput = document.getElementById("grid");

  lockButton.disabled = true; // Disable the lock button
  gridSizeInput.disabled = true; // Disable the grid size input

  // Optional: Show a message or take further actions after locking
  alert(`Grid size locked to ${grid - 1}x${grid - 1}.`);
  gridLocked = true;
  nameTeams();
}

function lockTeams() {
  const lockButton = document.getElementById("lockTeamButton");
  const teamSizeInput = document.getElementById("numberOfTeams");

  lockButton.disabled = true; // Disable the lock button
  teamSizeInput.disabled = true; // Disable the grid size input

  // Optional: Show a message or take further actions after locking
  alert(`Number of teams set to ${numberOfTeams}.`);
  teamLocked = true;
  nameTeams();

  // Generate input fields for team names
  nameTeams(numberOfTeams);
}

function nameTeams(numberofTeams) {
  if (teamLocked && gridLocked) {
    alert("time to name the teams");
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
    let finalizeButton = document.getElementById("finalizeTeamsButton");
    if (!finalizeButton) {
      finalizeButton = document.createElement("button");
      finalizeButton.id = "finalizeTeamsButton";
      finalizeButton.textContent = "Finalize Team Names";
      container.appendChild(finalizeButton);

      // Add event listener for the finalize button
      finalizeButton.addEventListener("click", function () {
        const teams = createTeams(numberOfTeams);
        console.log(teams); // Now teams will have names populated from input fields
      });
    }
  }
}

function createTeams(numberOfTeams) {
  const teamsArray = [];

  for (i = 1; i <= numberOfTeams; i++) {
    let team = {
      id: "team" + i,
      name: document.getElementById(`teamName${i}`).value, // Get the name from the input
      color: colors[(i - 1) % colors.length],
      PTBoat: [],
      Submarine: [],
      Cruiser: [],
      Destroyer: [],
      Battleship: [],
      AircraftCarrier: [],
    };
    teamsArray.push(team);
  }
  return teamsArray;
}

function addTable() {
  let myTableDiv = document.getElementById("myDynamicTable");
  while (myTableDiv.firstChild) {
    myTableDiv.removeChild(myTableDiv.firstChild);
  }
  let table = document.createElement("TABLE");
  table.border = "1";
  let tableBody = document.createElement("TBODY");
  table.appendChild(tableBody);

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
            const quadrantCell = table.rows[i + x].cells[j + y];
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
  myTableDiv.appendChild(table);
}

document.getElementById("grid").addEventListener("change", function () {
  const selectedValue = parseInt(this.value); // Get the selected value
  grid = selectedValue + 1;
  document.getElementById(
    "selectedGrid"
  ).textContent = `Selected: ${selectedValue}`;
  addTable();
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

addTable();
