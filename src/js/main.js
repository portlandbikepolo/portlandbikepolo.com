// Get the 'to top' button element by ID
var toTopButton = document.querySelector("#top");

// Check if the button exists
if (toTopButton) {
  // On scroll event, toggle button visibility based on scroll position
  window.onscroll = function () {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      toTopButton.classList.remove("hidden");
    } else {
      toTopButton.classList.add("hidden");
    }
  };

  // Function to scroll to the top of the page smoothly
  window.goToTop = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
}
