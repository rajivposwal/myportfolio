document.addEventListener('DOMContentLoaded', () => {

    /* --- DATA MANAGEMENT (Mock Database) --- */
    let libraryBooks = [
        { id: 'ISBN-001', title: 'The Quantum Reality', author: 'Dr. Z. Void', section: 'Science', available: 5, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop' },
        { id: 'ISBN-002', title: 'Cybernetic Dreams', author: 'A.I. Writer', section: 'Fiction', available: 3, image: 'https://images.unsplash.com/photo-1614728853913-1e32005e307e?q=80&w=1000&auto=format&fit=crop' },
        { id: 'ISBN-003', title: 'Ancient Code', author: 'Histobot', section: 'History', available: 2, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000&auto=format&fit=crop' },
        { id: 'ISBN-004', title: 'Neural Networks 101', author: 'Brainiac', section: 'Technology', available: 10, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop' },
        { id: 'ISBN-005', title: 'Digital Artistry', author: 'Pixel Master', section: 'Arts', available: 4, image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop' }
    ];

    let userRentals = []; // { userEmail, bookId, rentDate, dueDate, returned: false }
    let currentUser = null; // { email, phone }
    let isAdmin = false;

    // Load from local storage if exists
    if (localStorage.getItem('nexlib_books')) {
        libraryBooks = JSON.parse(localStorage.getItem('nexlib_books'));
    }
    if (localStorage.getItem('nexlib_rentals')) {
        userRentals = JSON.parse(localStorage.getItem('nexlib_rentals'));
    }

    function saveData() {
        localStorage.setItem('nexlib_books', JSON.stringify(libraryBooks));
        localStorage.setItem('nexlib_rentals', JSON.stringify(userRentals));
    }

    /* --- DOM ELEMENTS --- */
    // Containers
    const loginContainer = document.getElementById('login-container');
    const userDashboard = document.getElementById('user-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');

    // Login Form
    const userForm = document.getElementById('user-login-form');
    const adminForm = document.getElementById('admin-login-form');
    const loginSelection = document.getElementById('login-selection');
    const btnSelectUser = document.getElementById('btn-select-user');
    const btnSelectAdmin = document.getElementById('btn-select-admin');
    const btnBackUser = document.getElementById('btn-back-user');
    const btnBackAdmin = document.getElementById('btn-back-admin');
    const btnSendOtp = document.getElementById('btn-send-otp');
    const btnVerifyOtp = document.getElementById('btn-verify-otp');
    const otpSection = document.getElementById('otp-section');

    // User Dashboard Elements
    const booksGrid = document.getElementById('books-grid');
    const rentalsList = document.getElementById('rentals-list');
    const userLogout = document.getElementById('user-logout');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const bookSearch = document.getElementById('book-search');

    // Admin Dashboard Elements
    const adminBooksTable = document.getElementById('admin-books-table');
    const adminLogout = document.getElementById('admin-logout');
    const btnAddBookModal = document.getElementById('btn-add-book-modal');
    const bookModal = document.getElementById('book-modal');
    const bookForm = document.getElementById('book-form');
    const closeModal = document.querySelector('.close-modal');

    /* --- LOGIN LOGIC --- */

    // Toggle Login View
    // Selection Logic
    btnSelectUser.addEventListener('click', () => {
        loginSelection.classList.add('hidden');
        userForm.classList.remove('hidden');
    });

    btnSelectAdmin.addEventListener('click', () => {
        loginSelection.classList.add('hidden');
        adminForm.classList.remove('hidden');
    });

    btnBackUser.addEventListener('click', () => {
        userForm.classList.add('hidden');
        loginSelection.classList.remove('hidden');
    });

    btnBackAdmin.addEventListener('click', () => {
        adminForm.classList.add('hidden');
        loginSelection.classList.remove('hidden');
    });

    // User Login (OTP Simulation)
    let generatedOtp = null;

    btnSendOtp.addEventListener('click', () => {
        const email = document.getElementById('user-email').value;
        const phone = document.getElementById('user-phone').value;

        if (email && phone) {
            generatedOtp = Math.floor(1000 + Math.random() * 9000); // 4 digit OTP
            alert(`[SIMULATION] Your OTP is: ${generatedOtp}`);

            otpSection.classList.remove('hidden');
            btnSendOtp.classList.add('hidden');
            btnVerifyOtp.classList.remove('hidden');
            showToast(`OTP Sent to ${phone}`);
        } else {
            showToast('Please enter Email and Phone');
        }
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputOtp = document.getElementById('user-otp').value;
        const email = document.getElementById('user-email').value;
        const phone = document.getElementById('user-phone').value;

        if (inputOtp == generatedOtp) {
            currentUser = { email, phone };
            showToast(`Welcome, ${email}`);
            loginContainer.classList.add('hidden');
            userDashboard.classList.remove('hidden');
            loadUserDashboard();
        } else {
            showToast('Invalid OTP');
        }
    });

    // Admin Login
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-username').value;
        const pass = document.getElementById('admin-password').value;

        // Simple check
        if (user === 'admin' && pass === 'admin123') {
            isAdmin = true;
            showToast('Admin Access Granted');
            loginContainer.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
            loadAdminDashboard();
        } else {
            showToast('Invalid Admin Credentials');
        }
    });

    // Logout
    userLogout.addEventListener('click', () => {
        location.reload();
    });
    adminLogout.addEventListener('click', () => {
        location.reload();
    });


    /* --- USER DASHBOARD LOGIC --- */

    function loadUserDashboard() {
        document.getElementById('display-user-email').innerText = currentUser.email;
        renderAvailableBooks();
        renderUserRentals();
        updateUserStats();
    }

    // Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    function renderAvailableBooks(filter = "") {
        booksGrid.innerHTML = "";
        libraryBooks.forEach(book => {
            if (book.available > 0 && book.title.toLowerCase().includes(filter.toLowerCase())) {
                const card = document.createElement('div');
                card.className = 'book-card';
                // Use image if available, else default icon
                const coverContent = book.image ?
                    `<img src="${book.image}" alt="${book.title}" style="width:100%; height:100%; object-fit:cover;">` :
                    `<i class="fas fa-book"></i>`;

                card.innerHTML = `
                    <div class="book-cover">
                        ${coverContent}
                    </div>
                    <div class="book-details">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">By ${book.author}</p>
                        <span class="book-section">${book.section}</span>
                    </div>
                     <div class="book-actions">
                        <button onclick="rentBook('${book.id}')">Rent Book</button>
                    </div>
                `;
                booksGrid.appendChild(card);
            }
        });
    }

    // Expose function globally
    window.rentBook = function (bookId) {
        if (!currentUser) return;

        // Check if already rented
        const alreadyRented = userRentals.find(r => r.bookId === bookId && r.userEmail === currentUser.email && !r.returned);
        if (alreadyRented) {
            showToast("You already have this book!");
            return;
        }

        const bookIndex = libraryBooks.findIndex(b => b.id === bookId);
        if (libraryBooks[bookIndex].available > 0) {
            libraryBooks[bookIndex].available--;

            const rentDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // 1 week

            userRentals.push({
                rentalId: Date.now(),
                userEmail: currentUser.email,
                bookId: bookId,
                rentDate: rentDate.toISOString(),
                dueDate: dueDate.toISOString(),
                returned: false
            });

            saveData();
            loadUserDashboard(); // Refresh UI
            showToast("Book Rented Successfully!");
        }
    };

    function renderUserRentals() {
        rentalsList.innerHTML = "";
        const myRentals = userRentals.filter(r => r.userEmail === currentUser.email && !r.returned);

        if (myRentals.length === 0) {
            rentalsList.innerHTML = "<p>No active rentals.</p>";
            return;
        }

        const table = document.createElement('table');
        table.className = 'tech-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Book</th>
                    <th>Due Date</th>
                    <th>Status/Fine</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        myRentals.forEach(rental => {
            const book = libraryBooks.find(b => b.id === rental.bookId);
            const dueDate = new Date(rental.dueDate);
            const now = new Date();

            // Calc Fine
            let fine = 0;
            let status = "Active";

            // Check if late (simulated logic: if now > dueDate)
            // Note: Since you can't legitimately wait a week in a demo, 
            // In a real app this is automatic. Here, if the due date is passed, fine applies.

            if (now > dueDate) {
                fine = 100;
                status = "Overdue";
            } else {
                // Calculate days left
                const diffTime = Math.abs(dueDate - now);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                status = `${diffDays} Days Left`;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${dueDate.toDateString()}</td>
                <td style="color: ${fine > 0 ? 'red' : 'inherit'}">${fine > 0 ? '₹' + fine + ' Fine' : status}</td>
                <td><button onclick="returnBook(${rental.rentalId})" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Return</button></td>
            `;
            table.querySelector('tbody').appendChild(row);
        });
        rentalsList.appendChild(table);
    }

    window.returnBook = function (rentalId) {
        const rentalIndex = userRentals.findIndex(r => r.rentalId === rentalId);
        if (rentalIndex !== -1) {
            const rental = userRentals[rentalIndex];

            // Return book stock
            const bookIndex = libraryBooks.findIndex(b => b.id === rental.bookId);
            libraryBooks[bookIndex].available++;

            // Mark returned
            userRentals[rentalIndex].returned = true;

            const now = new Date();
            const due = new Date(rental.dueDate);
            if (now > due) {
                alert(`Book returned late! You have been charged a fine of ₹100.`);
            } else {
                showToast("Book returned on time!");
            }

            saveData();
            loadUserDashboard();
        }
    }

    function updateUserStats() {
        const myRentals = userRentals.filter(r => r.userEmail === currentUser.email && !r.returned);
        document.getElementById('active-rentals-count').innerText = myRentals.length;

        // Calculate fines history
        // In a real app, fines would be stored. Here we just calc active fines.
        let currentFines = 0;
        const now = new Date();
        myRentals.forEach(r => {
            if (now > new Date(r.dueDate)) currentFines += 100;
        });
        document.getElementById('total-fines').innerText = `₹${currentFines}`;
    }

    bookSearch.addEventListener('input', (e) => {
        renderAvailableBooks(e.target.value);
    });


    /* --- ADMIN DASHBOARD LOGIC --- */

    function loadAdminDashboard() {
        renderAdminBooks();
    }

    function renderAdminBooks() {
        adminBooksTable.innerHTML = "";
        libraryBooks.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.section}</td>
                <td>${book.available} Available</td>
                <td>
                    <button onclick="editBook('${book.id}')" style="font-size:0.8rem; padding: 0.3rem;">Edit</button>
                    <button onclick="deleteBook('${book.id}')" style="font-size:0.8rem; padding: 0.3rem; border-color: red; color: red;">X</button>
                </td>
            `;
            adminBooksTable.appendChild(row);
        });
    }

    // Show/Hide Modal
    btnAddBookModal.addEventListener('click', () => {
        document.getElementById('book-id').value = ''; // Clear for new
        document.getElementById('book-form').reset();
        document.getElementById('modal-title').innerText = "Add New Book";
        bookModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        bookModal.classList.add('hidden');
    });

    // Add/Edit Book Logic
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('book-id').value;
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const section = document.getElementById('book-section').value;

        if (id) {
            // Edit
            const index = libraryBooks.findIndex(b => b.id === id);
            libraryBooks[index].title = title;
            libraryBooks[index].author = author;
            libraryBooks[index].section = section;
            showToast("Book Updated");
        } else {
            // Add
            const newBook = {
                id: 'ISBN-' + Math.floor(Math.random() * 1000),
                title: title,
                author: author,
                section: section,
                available: 5 // Default
            };
            libraryBooks.push(newBook);
            showToast("Book Added");
        }

        saveData();
        bookModal.classList.add('hidden');
        renderAdminBooks();
    });

    window.editBook = function (id) {
        const book = libraryBooks.find(b => b.id === id);
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-section').value = book.section;

        document.getElementById('modal-title').innerText = "Edit Book";
        bookModal.classList.remove('hidden');
    }

    window.deleteBook = function (id) {
        if (confirm('Delete this book?')) {
            libraryBooks = libraryBooks.filter(b => b.id !== id);
            saveData();
            renderAdminBooks();
            showToast("Book Deleted");
        }
    }


    /* --- UTILS --- */
    function showToast(msg) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

});
