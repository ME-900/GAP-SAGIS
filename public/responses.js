async function loadResponses() {
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  try {
    const res = await fetch("/responses-data", {
      headers: { Authorization: token },
    });
    const rows = await res.json();
    renderTable(rows);
  } catch (err) {
    document.getElementById("tableWrap").textContent = "Failed to load responses.";
  }
}

function renderTable(rows) {
  const wrap = document.getElementById("tableWrap");
  if (!rows.length) {
    wrap.textContent = "No responses yet.";
    return;
  }
  const columns = Object.keys(rows[0]);
  let html = "<table><thead><tr>";
  columns.forEach(c => (html += `<th>${c}</th>`));
  html += "<th>Delete</th></tr></thead><tbody>";
  rows.forEach(row => {
    html += "<tr>";
    columns.forEach(c => (html += `<td>${row[c] ?? ""}</td>`));
    html += `<td><button onclick="deleteRow(${row.id})">Delete</button></td></tr>`;
  });
  html += "</tbody></table>";
  wrap.innerHTML = html;
}

async function deleteRow(id) {
  if (!confirm("Delete this response?")) return;
  await fetch(`/delete/${id}`, { method: "DELETE" });
  loadResponses();
}

async function clearAll() {
  if (!confirm("Delete ALL responses? This cannot be undone.")) return;
  await fetch("/clear", { method: "DELETE" });
  loadResponses();
}

function exportExcel() {
  window.location.href = "/export";
}

loadResponses();
