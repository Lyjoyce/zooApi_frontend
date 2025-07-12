
function toggleTable() {
      const table = document.getElementById("ranch-table");
      if (table.style.display === "none" || table.style.display === "") {
        table.style.display = "block";
      } else {
        table.style.display = "none";
      }
    }

    /*function toggleTable() {
  const table = document.getElementById("us-table");
  table.style.display = table.style.display === "none" ? "table" : "none";
}*/