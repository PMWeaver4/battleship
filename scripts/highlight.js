//code right before addtable function

let highlightMode = "horizontal"; // Default is horizontal

// Function to update the highlight mode based on the key pressed
function handleKeyPress(event) {
  if (event.key === "h") {
    highlightMode = "horizontal"; // Set highlight mode to horizontal
    console.log("Highlight mode set to horizontal");
  } else if (event.key === "v") {
    highlightMode = "vertical"; // Set highlight mode to vertical
    console.log("Highlight mode set to vertical");
  }

  // Reset highlight color for all cells when mode changes
  resetHighlightedCells();
}

// Function to reset the background color of all cells
function resetHighlightedCells() {
  let cells = gridTable.getElementsByTagName("td");
  for (let cell of cells) {
    cell.style.backgroundColor = "";
  }
}

// Listen for the 'keydown' event to switch between horizontal and vertical mode
document.addEventListener("keydown", handleKeyPress);

//code to go in addtable function:

// Add mouseover and mouseout event listeners to each cell
td.addEventListener("mouseover", function () {
  // Highlight the current cell
  td.style.backgroundColor = "#f0f0f0";

  if (highlightMode === "horizontal") {
    // Highlight the next cell in the row (if it exists)
    let nextCell = td.nextElementSibling;
    if (nextCell) {
      nextCell.style.backgroundColor = "#f0f0f0";
    }
  } else if (highlightMode === "vertical") {
    // Highlight the cell below (if it exists)
    let nextRow = gridTable.rows[i + 1]; // Get the next row
    if (nextRow) {
      let nextCellInRow = nextRow.cells[j]; // Get the cell below
      if (nextCellInRow) {
        nextCellInRow.style.backgroundColor = "#f0f0f0";
      }
    }
  }
});

td.addEventListener("mouseout", function () {
  // Reset the current cell background color
  td.style.backgroundColor = "";

  if (highlightMode === "horizontal") {
    // Reset the next cell background color (if it exists)
    let nextCell = td.nextElementSibling;
    if (nextCell) {
      nextCell.style.backgroundColor = "";
    }
  } else if (highlightMode === "vertical") {
    // Reset the cell below (if it exists)
    let nextRow = gridTable.rows[i + 1]; // Get the next row
    if (nextRow) {
      let nextCellInRow = nextRow.cells[j]; // Get the cell below
      if (nextCellInRow) {
        nextCellInRow.style.backgroundColor = "";
      }
    }
  }
});

//this doesn't work, because it is assuming "currentTeam" is defined
// Add the click event listener for storing coordinates
td.addEventListener("click", () => {
  if (selectMode == true) {
    clickedCoordinate = { i, j };
    console.log(
      `Cell clicked: ${String.fromCharCode(i + 64)}${j} (Row: ${i}, Col: ${j})`
    );

    // Add this coordinate to the relevant ship or team object (you can change this part)
    td.style.backgroundColor = "yellow"; // Visually mark the selected cell
  }
});
