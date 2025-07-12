// dashboard.js — utilisé sur les pages protégées
const token = sessionStorage.getItem("jwt");
if (!token) {
  window.location.href = "/login.html";
}
