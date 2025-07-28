document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());
    const res = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    alert(await res.text());
  });