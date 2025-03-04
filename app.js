let notes = JSON.parse(localStorage.getItem('notes')) || []; // Retrieve notes from localStorage or initialize an empty array

// Handle the note submission
document.getElementById('noteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;
    const currentDate = new Date(); // Get current date and time for sorting by date

    if (noteTitle.trim() === "" || noteContent.trim() === "") {
        alert("Please fill out both fields!");
        return;
    }

    // Check if we are editing an existing note or creating a new one
    const noteId = document.getElementById('submitBtn').dataset.noteId;

    if (noteId) {
        // Edit existing note
        const noteIndex = notes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = noteTitle;
            notes[noteIndex].content = noteContent;
            notes[noteIndex].date = currentDate; // Update date to reflect the latest edit
        }
        document.getElementById('submitBtn').removeAttribute('data-note-id'); // Remove edit context
        document.getElementById('submitBtn').textContent = 'Save Note'; // Change button text back
    } else {
        // Create new note
        const newNote = {
            id: Date.now().toString(), // Unique ID based on timestamp
            title: noteTitle,
            content: noteContent,
            date: currentDate
        };
        notes.push(newNote);
    }

    // Save notes to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Clear form fields
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';

    // Display the updated notes list
    displayNotes();

    // Show SweetAlert after saving a note
    Swal.fire({
        icon: 'success',
        title: 'Note Saved',
        text: 'Your note has been saved successfully!',
        confirmButtonText: 'Okay'
    });
});

// Function to display notes
function displayNotes() {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = ''; // Clear the container before displaying the notes

    // Get the search query
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();

    // Filter notes based only on the title search query
    const filteredNotes = notes.filter(note => {
        return note.title.toLowerCase().includes(searchQuery); // Only search by title
    });

    // Display filtered notes
    filteredNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('card', 'note-card');
        noteCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <p class="card-text">${note.content}</p>
                <p class="card-text"><small class="text-muted">Created on ${moment(note.date).format('MMMM Do YYYY, h:mm:ss a')}</small></p>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                <button class="btn btn-warning btn-sm ms-2 edit-btn">Edit</button>
            </div>
        `;
        notesContainer.appendChild(noteCard);

        // Add event listener for delete button
        noteCard.querySelector('.delete-btn').addEventListener('click', function () {
            notes = notes.filter(n => n.id !== note.id); // Remove the note from the array
            localStorage.setItem('notes', JSON.stringify(notes)); // Update localStorage
            displayNotes(); // Re-render the notes
        });

        // Add event listener for edit button
        noteCard.querySelector('.edit-btn').addEventListener('click', function () {
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('submitBtn').textContent = 'Update Note'; // Change button text to "Update"
            document.getElementById('submitBtn').dataset.noteId = note.id; // Store note ID for editing
        });
    });
}

// Search functionality (search on input change)
document.getElementById('searchBar').addEventListener('input', function() {
    displayNotes(); // Re-display the notes based on search input
});

// Sort notes by date (ascending)
document.getElementById('sortByDateBtn').addEventListener('click', function() {
    // Sort notes array by the 'date' field (ascending order)
    notes.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Save sorted notes back to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Re-display the sorted notes
    displayNotes();
});

// Sort notes by title (alphabetically)
document.getElementById('sortByTitleBtn').addEventListener('click', function() {
    // Sort notes array by the 'title' field alphabetically
    notes.sort((a, b) => a.title.localeCompare(b.title));

    // Save sorted notes back to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Re-display the sorted notes
    displayNotes();
});

// Initial display of notes when the page loads
displayNotes();

Swal.fire({
    icon: 'success',
    title: 'Note Saved',
    text: 'Your note has been saved successfully!',
    confirmButtonText: 'Okay'
});