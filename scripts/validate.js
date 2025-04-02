let coordinatesInput;

while (true) {
  coordinatesInput = prompt(
    `Enter the upper left coordinates for the ${boatType} (e.g., A1, B3, etc.)`
  );

  // Convert input to uppercase
  let normalizedInput = coordinatesInput.toUpperCase();

  // Check if the first character is a letter between A and W
  const isValidLetter = /^[A-W]/.test(normalizedInput.charAt(0));

  // Check if the second and/or third characters are numbers between 1 and 23
  const isValidNumber =
    /^\d{1,2}$/.test(normalizedInput.slice(1)) &&
    parseInt(normalizedInput.slice(1)) >= 1 &&
    parseInt(normalizedInput.slice(1)) <= 23;

  // If both conditions are met, break out of the loop
  if (isValidLetter && isValidNumber) {
    console.log("Valid input.");
    break;
  } else {
    // Prompt again if the input is invalid
    alert(
      "Invalid input. The first character must be a letter between A and W, and the second and/or third characters must be a number between 1 and 23. Please re-enter the coordinates."
    );
  }
}
