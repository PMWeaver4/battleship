let grid = 21;
let numberOfTeams = 1;

function lockGrid() {
  const lockButton = document.getElementById("lockGridButton");
  const gridSizeInput = document.getElementById("grid");

  lockButton.disabled = true; // Disable the lock button
  gridSizeInput.disabled = true; // Disable the grid size input

  // Optional: Show a message or take further actions after locking
  alert(`Grid size locked to ${grid - 1}x${grid - 1}.`);
}

function lockTeams() {
  const lockButton = document.getElementById("lockTeamButton");
  const teamSizeInput = document.getElementById("numberOfTeams");

  lockButton.disabled = true; // Disable the lock button
  teamSizeInput.disabled = true; // Disable the grid size input

  // Optional: Show a message or take further actions after locking
  alert(`Number of teams set to ${numberOfTeams}.`);

  // Generate input fields for team names
  //next steps: add a team name input field, create team objects that include ships, etc.
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
