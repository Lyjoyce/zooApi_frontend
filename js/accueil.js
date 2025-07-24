function toggleTable() {
  const table = document.getElementById("ranch-table");
  if (table) {
    table.style.display = (table.style.display === "none" || table.style.display === "") ? "block" : "none";
  }
}
