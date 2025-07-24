document.getElementById('bookForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const book = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    isbn: document.getElementById('isbn').value.trim(),
    genre: document.getElementById('genre').value.trim(),
    year: parseInt(document.getElementById('year').value),
    publisher: document.getElementById('publisher').value.trim()
  };

  const allFilled = Object.values(book).every(val => val !== "" && val !== null);
  if (!allFilled) {
    document.getElementById('message').innerText = "Please fill all fields.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });

    const result = await res.json();
    document.getElementById('message').innerText = result.message;
    document.getElementById('bookForm').reset();
  } catch (err) {
    document.getElementById('message').innerText = "Error saving book.";
    console.error(err);
  }
});