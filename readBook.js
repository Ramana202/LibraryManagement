window.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('tableBody');
  const message = document.getElementById('message');

  try {
    const response = await fetch("http://localhost:3000/books");
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      message.textContent = "No books found.";
      return;
    }

    data.forEach(book => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td>${book.publisher}</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    message.textContent = "Error loading books.";
    console.error(err);
  }
});