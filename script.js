// Define a JSON structure for the seating
const seatingLayout = {
  front: ["A", "B", "C", "D"], // You can extend this array based on your needs
  middle: ["E", "F", "G", "H"], // Adjust accordingly
  back: ["I", "J", "K", "L", "M", "N", "O"], // Adjust accordingly
};

// Define an array of sold seats in a JSON structure
const soldSeats = {
  D: [14, 15],
  E: [17, 18],
  F: [20, 21],
  K: [10, 11, 12],
  M: [1, 2, 3],
  O: [5, 6, 7, 8],
};

// Define elements
let seats;
const container = document.querySelector(".container");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
let ticketPrice = +movieSelect.value;

/* FUNCTIONS */
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

function reserveSeat(seat) {
  if (!seat.classList.contains("sold")) {
    seat.classList.add("selected");
    updateSelectedCount();
  }
}
/* Generate Seats */
function generateRow(rowId, numOfSeats, soldSeatsForRow) {
  const row = document.createElement("div");
  row.classList.add("row");
  for (let i = 1; i <= numOfSeats; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    const seatNumber = i < 10 ? `0${i}` : i;
    const seatId = `${rowId}${seatNumber}`;
    seat.dataset.seat = seatId;

    // Skip sold seats
    if (soldSeatsForRow.includes(i)) {
      seat.classList.add("sold");
    } else {
      // Create and append the reserve button
      const button = document.createElement("button");
      button.classList.add("reserve-button");
      button.innerText = "Reserve Seat"; // Default text
      button.style.display = "none"; // Button is hidden by default
      seat.appendChild(button);

      // Show the button with appropriate text on hover
      seat.onmouseenter = () => {
        button.style.display = "block"; // Show the button
        button.innerText = seat.classList.contains("selected")
          ? "Remove Seat"
          : "Reserve Seat";
      };

      // Hide the button when not hovered
      seat.onmouseleave = () => {
        if (!seat.classList.contains("justClicked")) {
          button.style.display = "none";
        }
      };

      // Toggle seat selection and handle button visibility and text on click
      button.onclick = () => {
        seat.classList.toggle("selected");
        seat.classList.add("justClicked"); // Mark seat as just clicked to manage hover behavior
        setTimeout(() => seat.classList.remove("justClicked"), 0); // Remove the mark immediately after
        // Adjust the button display based on new selection status
        button.innerText = seat.classList.contains("selected")
          ? "Remove Seat"
          : "Reserve Seat";
        button.style.display = "none"; // Optionally hide the button immediately after click
        updateSelectedCount();
      };
    }

    row.appendChild(seat);
  }
  return row;
}

function generateSeatingLayout() {
  const seatsContainer = document.querySelector(".seats");
  seatsContainer.innerHTML = ""; // Clear previous seating layout

  Object.keys(seatingLayout).forEach((sectionKey) => {
    const sectionElement = document.createElement("div");
    sectionElement.classList.add(sectionKey); // e.g., 'front', 'middle', 'back'
    seatingLayout[sectionKey].forEach((rowId) => {
      sectionElement.appendChild(
        generateRow(rowId, 22, soldSeats[rowId] || [])
      ); // Pass soldSeats for each row
    });
    seatsContainer.appendChild(sectionElement);
  });

  seats = document.querySelectorAll(".row .seat:not(.sold)"); // Update seats NodeList
}

// Generate the seating layout
document.addEventListener("DOMContentLoaded", () => {
  generateSeatingLayout();
  populateUI();
  updateSelectedCount();
});

// Update total and count to incorporate dynamic footer text
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // Generate the indices of selected seats for localStorage
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;
  const selectedSeatNumbers = [...selectedSeats].map(
    (seat) => seat.dataset.seat
  );

  // Wrapping each seat number with a span tag before joining
  let selectedSeatsText = selectedSeatNumbers.map(
    (seat) => `<span>${seat}</span>`
  );
  if (selectedSeatsText.length > 1) {
    selectedSeatsText[selectedSeatsText.length - 1] =
      " & " + selectedSeatsText[selectedSeatsText.length - 1];
  }
  selectedSeatsText = selectedSeatsText.join(", ").replace(", &", " &");

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;

  // Dynamically update the footer text based on selected seats count
  const textSelectedSeats = document.querySelector(".text.selectedSeats");
  if (selectedSeatsCount === 0) {
    textSelectedSeats.innerHTML = "No seats are being selected.";
  } else {
    const seatOrSeats = selectedSeatsCount > 1 ? "seats" : "seat";
    textSelectedSeats.innerHTML = `Selected ${seatOrSeats}: ${selectedSeatsText}`;
  }

  // Save the total price to localStorage
  localStorage.setItem("totalPrice", total.innerText);

  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}


function populateUI() {
  // Restore selected seats
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }
  // Restore the selected movie index
  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");
  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
    ticketPrice = +movieSelect.value;
  }

  // Retrieve and display the saved total
  const savedTotal = localStorage.getItem("totalPrice");
  if (savedTotal !== null) {
    total.innerText = savedTotal;
  } else {
    // Initialize total as 0 if no saved total found
    total.innerText = "0";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  generateSeatingLayout();
  populateUI();
  updateSelectedCount();
  adjustContainerPositionForSmallDevices(); // Add this line

  // Remove the old click event listener on the container
  // Assuming 'container' is defined elsewhere and you want to remove an existing event listener.
  // Note: This code snippet as provided might not work if 'handleSeatClick' was not previously attached using `container.addEventListener`.
  // So, ensure that 'handleSeatClick' is correctly defined and attached if you're intending to remove it.
  container.removeEventListener("click", handleSeatClick);

  // You can define handleSeatClick if you ever need to reattach the event listener
  function handleSeatClick(e) {
    if (e.target.classList.contains("seat") && !e.target.classList.contains("sold")) {
      e.target.classList.toggle("selected");
      updateSelectedCount();
    }
  }

  // Event listener for movie selection change
  movieSelect.addEventListener("change", (e) => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
  });

  // Adjust container position on resize as well
  window.addEventListener('resize', adjustContainerPositionForSmallDevices);
});

// Define the adjustContainerPositionForSmallDevices function outside of the DOMContentLoaded listener
function adjustContainerPositionForSmallDevices() {
  const viewContainer = document.querySelector('.view-container');
  if (window.innerWidth < 768) {
    // This calculation centers the .container if its width is larger than the viewport width
    const scrollX = (viewContainer.scrollWidth - window.innerWidth) / 2;
    viewContainer.scrollLeft = scrollX;
  }
}
