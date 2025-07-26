let books = [];

async function fetchBooks() {
  const res = await fetch("http://localhost:3000/books");
  books = await res.json();
  displayBooks(books);
  updateReport(books);
}

function displayBooks(data) {
  const tbody = document.getElementById('updateBody');
  tbody.innerHTML = '';

  data.forEach(book => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td><input type="text" value="${book.genre}" id="genre-${book._id}"></td>
      <td><input type="number" value="${book.year}" min="1000" max="2100" id="year-${book._id}"></td>
      <td><input type="text" value="${book.publisher}" id="publisher-${book._id}"></td>
      <td><button onclick="updateBook('${book._id}')">Update</button></td>
    `;

    tbody.appendChild(row);
  });
}

async function updateBook(id) {
  const genre = document.getElementById(`genre-${id}`).value.trim();
  const year = parseInt(document.getElementById(`year-${id}`).value);
  const publisher = document.getElementById(`publisher-${id}`).value.trim();

  if (!genre || !publisher || isNaN(year) || year < 1000 || year > 2100) {
    alert("Invalid input. Please check genre, publisher, and year.");
    return;
  }

  const res = await fetch(`http://localhost:3000/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ genre, year, publisher })
  });

  const data = await res.json();
  alert(data.message);
  fetchBooks(); // refresh list
}

function updateReport(data) {
  document.getElementById('totalCount').textContent = data.length;
  const avg = data.reduce((sum, b) => sum + b.year, 0) / data.length;
  document.getElementById('avgYear').textContent = Math.round(avg);
}

// Sorting
document.getElementById('sortSelect').addEventListener('change', e => {
  const key = e.target.value;
  if (key) {
    const sorted = [...books].sort((a, b) => a[key] - b[key]);
    displayBooks(sorted);
    updateReport(sorted);
  }
});

// Search
document.getElementById('searchBox').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(query));
  displayBooks(filtered);
  updateReport(filtered);
});

fetchBooks();