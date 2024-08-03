const searchInput = document.getElementById("search-note");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const notesComponent = document.querySelector("notes-component");
  notesComponent.filterNotes(searchTerm);
});
