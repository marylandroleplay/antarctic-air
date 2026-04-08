const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('btn-logout');

// Check authentication on load
async function checkAuth() {
    try {
        const res = await fetch('/api/admin/check-auth');
        const data = await res.json();
        if (data.authenticated) {
            showDashboard();
            loadDashboardData();
        } else {
            showLogin();
        }
    } catch (err) {
        showLogin();
    }
}

function showLogin() {
    loginView.classList.remove('hidden');
    loginView.classList.add('flex');
    dashboardView.classList.add('hidden');
}

function showDashboard() {
    loginView.classList.add('hidden');
    loginView.classList.remove('flex');
    dashboardView.classList.remove('hidden');
}

// Login Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('login-msg');

    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (res.ok) {
            msg.textContent = '';
            showDashboard();
            loadDashboardData();
        } else {
            const data = await res.json();
            msg.textContent = data.error || 'Login failed';
        }
    } catch (err) {
        msg.textContent = 'Network error';
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    showLogin();
});

// Load Dashboard Data
async function loadDashboardData() {
    loadAppointments();
    loadContacts();
}



// Load Appointments
async function loadAppointments() {
    const res = await fetch('/api/appointments');
    if (res.ok) {
        const data = await res.json();
        const tbody = document.getElementById('appointments-tbody');
        tbody.innerHTML = '';
        data.forEach(appt => {
            const tr = document.createElement('tr');
            const dateStr = new Date(appt.createdAt).toLocaleString();
            tr.innerHTML = `
                <td class="py-3 px-2 align-top">
                    <div class="font-bold">${appt.preferredDate}</div>
                    <div class="text-xs text-on-surface-variant">${appt.preferredTime}</div>
                </td>
                <td class="py-3 px-2 align-top">
                    <div class="font-bold">${appt.name}</div>
                    <div class="text-xs text-on-surface-variant">${appt.phone}</div>
                    <div class="text-xs text-on-surface-variant pr-4 block truncate w-40" title="${appt.email}">${appt.email}</div>
                </td>
                <td class="py-3 px-2 align-top text-primary font-bold text-xs">${appt.serviceType}</td>
                <td class="py-3 px-2 align-top">
                    <span class="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${appt.resolved ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-white'}">
                        ${appt.resolved ? 'Resolved' : 'Pending'}
                    </span>
                </td>
                <td class="py-3 px-2 align-top flex gap-2">
                    ${!appt.resolved ? `<button onclick="resolveItem('appointments', '${appt._id}')" class="text-primary hover:text-white text-xs border border-outline-variant/30 px-2 py-1 rounded">Resolve</button>` : ''}
                    <button onclick="deleteItem('appointments', '${appt._id}')" class="text-red-400 hover:text-white text-xs border border-red-500/30 px-2 py-1 rounded">Delete</button>
                    ${appt.notes ? `<button onclick="alert('Notes: ${appt.notes}')" class="text-slate-400 hover:text-white text-xs border border-outline-variant/30 px-2 py-1 rounded w-auto whitespace-pre">View Notes</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Load Contacts
async function loadContacts() {
    const res = await fetch('/api/contact');
    if (res.ok) {
        const data = await res.json();
        const tbody = document.getElementById('contacts-tbody');
        tbody.innerHTML = '';
        data.forEach(contact => {
            const tr = document.createElement('tr');
            const dateStr = new Date(contact.createdAt).toLocaleDateString();
            tr.innerHTML = `
                <td class="py-3 px-2 align-top">${dateStr}</td>
                <td class="py-3 px-2 align-top">
                    <div class="font-bold">${contact.name}</div>
                    <div class="text-xs text-on-surface-variant">${contact.phone}</div>
                    <div class="text-xs text-on-surface-variant">${contact.email}</div>
                </td>
                <td class="py-3 px-2 align-top text-primary font-bold text-xs">${contact.serviceType}</td>
                <td class="py-3 px-2 align-top max-w-[200px] truncate text-xs" title="${contact.message}">${contact.message}</td>
                <td class="py-3 px-2 align-top">
                    <span class="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${contact.resolved ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-white'}">
                        ${contact.resolved ? 'Resolved' : 'Pending'}
                    </span>
                </td>
                <td class="py-3 px-2 align-top flex gap-2">
                    ${!contact.resolved ? `<button onclick="resolveItem('contact', '${contact._id}')" class="text-primary hover:text-white text-xs border border-outline-variant/30 px-2 py-1 rounded">Resolve</button>` : ''}
                    <button onclick="deleteItem('contact', '${contact._id}')" class="text-red-400 hover:text-white text-xs border border-red-500/30 px-2 py-1 rounded">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function resolveItem(type, id) {
    if (confirm('Mark as resolved?')) {
        await fetch(`/api/${type}/${id}/resolve`, { method: 'PUT' });
        if (type === 'appointments') loadAppointments();
        else loadContacts();
    }
}

async function deleteItem(type, id) {
    if (confirm('Are you sure you want to delete this?')) {
        await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
        if (type === 'appointments') loadAppointments();
        else loadContacts();
    }
}

window.resolveItem = resolveItem;
window.deleteItem = deleteItem;

checkAuth();
