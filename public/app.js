document.addEventListener("DOMContentLoaded", function () {
    const authSection = document.getElementById("authSection");
    const noteSection = document.getElementById("noteSection");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const noteList = document.getElementById("noteList");
    const noteTitleInput = document.getElementById("noteTitle");
    const noteContentInput = document.getElementById("noteContent");
    const addNoteBtn = document.getElementById("addNoteBtn");

    registerBtn.addEventListener("click", register);
    loginBtn.addEventListener("click", login);
    logoutBtn.addEventListener("click", logout);
    addNoteBtn.addEventListener("click", addNote);

    async function register() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        alert(result);
    }

    async function login() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        alert(result);

        if (response.status === 200) {
            showNoteSection();
        }
    }

    function logout() {
        fetch('http://localhost:3000/logout')
            .then(response => response.text())
            .then(result => {
                alert(result);
                showAuthSection();
            })
            .catch(error => console.error('Logout error:', error));
    }

    async function addNote() {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (!title || !content) {
            alert("Please enter both note title and content.");
            return;
        }

        const response = await fetch('http://localhost:3000/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
            credentials: 'include',
        });

        const result = await response.text();
        alert(result);

        if (response.status === 200) {
            // Reload the notes after adding a new one
            getNotes();
        }
    }

    function showAuthSection() {
        authSection.style.display = 'block';
        noteSection.style.display = 'none';
    }

    function showNoteSection() {
        authSection.style.display = 'none';
        noteSection.style.display = 'block';

        // Load user's notes
        getNotes();
    }

    async function getNotes() {
        const response = await fetch('http://localhost:3000/notes', { credentials: 'include' });
        if (response.status === 401) {
            // If unauthorized, show the authentication section
            showAuthSection();
            return;
        }

        const userNotes = await response.json();
        displayNotes(userNotes);
    }

    function displayNotes(notes) {
        // Clear existing notes
        noteList.innerHTML = '';

        notes.forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.textContent = `${note.title}: ${note.content}`;
            noteList.appendChild(noteItem);
        });
    }
});
