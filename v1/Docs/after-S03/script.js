document.querySelector("#newFact").addEventListener("click", function () {
  document.querySelector(".fact-form").classList.toggle("hidden");
  if (document.querySelector(".fact-form").classList.contains("hidden")) {
    document.querySelector("#newFact").textContent = "Share fact";
  } else {
    document.querySelector("#newFact").textContent = "Close";
  }
});
