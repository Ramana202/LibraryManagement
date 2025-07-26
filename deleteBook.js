let books = [];

async function fetchBooks() {
  const res = await fetch("http://localhost:3000/books");
  books = await res.json();
  displayBooks(books);
  document.getElementById('totalCount').textContent = books.length;
}

function displayBooks(data) {
  const tbody = document.getElementById('deleteBody');
  tbody.innerHTML = '';

  data.forEach(book => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.year}</td>
      <td><button onclick="deleteBook('${book._id}')">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

async function deleteBook(id) {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:3000/books/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Delete failed:", data);
      return alert(data.message || "Error deleting book");
    }

    alert(data.message);
    fetchBooks();
  } catch (err) {
    console.error("Error deleting:", err);
    alert("Error deleting book");
  }
}

// Search filter
document.getElementById('searchBox').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(query));
  displayBooks(filtered);
  document.getElementById('totalCount').textContent = filtered.length;
});

fetchBooks();