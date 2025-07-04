let currentUser = null;
let tickets = [];
let ticketIdCounter = 1;

// dane do logowania
const users = {
    'admin@firma.com': { password: 'admin123', role: 'admin', initials: 'AD' },
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('GitDesk Application Starting...');
    
    loadData();
    setupEventListeners();
    
    if (tickets.length === 0) {
        generateSampleTickets();
    }
    
    updateTicketsTable();
    updateHeatmap();
    
    console.log('GitDesk Application Ready!');
});

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketSubmit);
    }

    const ticketSearch = document.getElementById('ticketSearch');
    if (ticketSearch) {
        ticketSearch.addEventListener('input', function(e) {
            searchTickets(e.target.value);
        });
    }

    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', function(e) {
            globalSearch(e.target.value);
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (users[email] && users[email].password === password) {
        currentUser = { email, ...users[email] };
        showPage('dashboardPage');
        document.getElementById('loginMessage').classList.add('hidden');
        console.log('User logged in:', currentUser.email);
    } else {
        document.getElementById('loginMessage').classList.remove('hidden');
        console.log('Login failed for:', email);
    }
}

function logout() {
    currentUser = null;
    showPage('loginPage');
    document.getElementById('loginForm').reset();
    console.log('User logged out');
}

function showPage(pageId) {
    console.log('Navigating to page:', pageId);
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');

    updateActiveMenuItems(pageId);

    if (pageId === 'ticketsPage') {
        updateTicketsTable();
    } else if (pageId === 'heatmapPage') {
        updateHeatmap();
    } else if (pageId === 'analyticsPage') {
        updateAnalytics();
    }
}

function updateActiveMenuItems(pageId) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const pageToMenuMap = {
        'dashboardPage': 0,
        'ticketsPage': 2,
        'analyticsPage': 4,
        'heatmapPage': 5
    };
    
    document.querySelectorAll('.sidebar').forEach(sidebar => {
        const menuItems = sidebar.querySelectorAll('.menu-item');
        const activeIndex = pageToMenuMap[pageId];
        if (menuItems[activeIndex]) {
            menuItems[activeIndex].classList.add('active');
        }
    });
}

function handleTicketSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('ticketTitle').value;
    const location = document.getElementById('ticketLocation').value;
    const priority = document.getElementById('ticketPriority').value;
    const description = document.getElementById('ticketDescription').value;
    
    const newTicket = {
        id: ticketIdCounter++,
        title,
        location,
        priority,
        description,
        status: 'Open',
        createdAt: new Date(),
        createdBy: currentUser ? currentUser.initials : 'US',
        coordinates: getLocationCoordinates(location)
    };
    
    tickets.push(newTicket);
    saveData();
    
    showMessage('successMessage', 'Zgłoszenie zostało utworzone pomyślnie!');
    
    document.getElementById('ticketForm').reset();
    
    updateHeatmap();
    
    console.log('New ticket created:', newTicket);
}

function getLocationCoordinates(location) {
    const locationMap = {
        'HD PR1': { x: 180, y: 195, hall: 'Hala1' },
        'Biuro - R&D': { x: 580, y: 170, hall: 'Hala1' },
        'Biuro - Księgowość': { x: 580, y: 300, hall: 'Hala1' },
        'Jadalnia': { x: 300, y: 380, hall: 'Hala1' },
        'Sala konferencyjna': { x: 105, y: 360, hall: 'Hala1' },
        'Brama wejściowa': { x: 350, y: 45, hall: 'Hala1' },
        
        'HD PR2': { x: 170, y: 190, hall: 'Hala2' },
        'HD PR3': { x: 570, y: 190, hall: 'Hala2' },
        'Kontrola jakości': { x: 300, y: 370, hall: 'Hala2' },
        'Warsztat': { x: 105, y: 370, hall: 'Hala2' },
        'Szatnia': { x: 580, y: 370, hall: 'Hala2' },
        'Brama towarowa': { x: 350, y: 45, hall: 'Hala2' },
        
        'Magazyn': { x: 350, y: 220, hall: 'Hala3' },
        'Magazyn surowców': { x: 130, y: 220, hall: 'Hala3' },
        'Magazyn produktów': { x: 580, y: 220, hall: 'Hala3' },
        'Biuro logistyki': { x: 105, y: 400, hall: 'Hala3' },
        'Strefa kompletacji': { x: 300, y: 400, hall: 'Hala3' },
        'Parking wózków': { x: 580, y: 400, hall: 'Hala3' },
        'Rampa załadunkowa': { x: 350, y: 50, hall: 'Hala3' }
    };
    return locationMap[location] || { x: 350, y: 250, hall: 'Hala1' };
}

function generateSampleTickets() {
    const sampleTickets = [
        {
            id: ticketIdCounter++,
            title: 'Awaria drukarki',
            location: 'HD PR1',
            priority: 'High',
            description: 'Drukarka nie drukuje dokumentów',
            status: 'Open',
            createdAt: new Date('2024-12-05'),
            createdBy: 'NW',
            coordinates: getLocationCoordinates('HD PR1')
        },
        {
            id: ticketIdCounter++,
            title: 'Problem z siecią',
            location: 'HD PR2',
            priority: 'Medium',
            description: 'Brak dostępu do internetu',
            status: 'In Progress',
            createdAt: new Date('2024-12-05'),
            createdBy: 'TC',
            coordinates: getLocationCoordinates('HD PR2')
        },
        {
            id: ticketIdCounter++,
            title: 'Uszkodzona maszyna',
            location: 'HD PR3',
            priority: 'High',
            description: 'Maszyna produkcyjna nr 3 nie działa',
            status: 'Open',
            createdAt: new Date('2024-12-05'),
            createdBy: 'JD',
            coordinates: getLocationCoordinates('HD PR3')
        },
        {
            id: ticketIdCounter++,
            title: 'Klimatyzacja',
            location: 'Biuro - R&D',
            priority: 'Low',
            description: 'Za gorąco w biurze R&D',
            status: 'Closed',
            createdAt: new Date('2024-12-04'),
            createdBy: 'KJ',
            coordinates: getLocationCoordinates('Biuro - R&D')
        },
        {
            id: ticketIdCounter++,
            title: 'Brak kawy',
            location: 'Jadalnia',
            priority: 'Medium',
            description: 'Ekspres do kawy nie działa',
            status: 'Closed',
            createdAt: new Date('2024-12-04'),
            createdBy: 'MW',
            coordinates: getLocationCoordinates('Jadalnia')
        },
        {
            id: ticketIdCounter++,
            title: 'Problem z bramą',
            location: 'Brama towarowa',
            priority: 'High',
            description: 'Brama automatyczna nie otwiera się',
            status: 'In Progress',
            createdAt: new Date('2024-12-03'),
            createdBy: 'SS',
            coordinates: getLocationCoordinates('Brama towarowa')
        },
        {
            id: ticketIdCounter++,
            title: 'Wymiana żarówki',
            location: 'Magazyn',
            priority: 'Low',
            description: 'Przepalona żarówka w magazynie',
            status: 'Closed',
            createdAt: new Date('2024-12-02'),
            createdBy: 'AD',
            coordinates: getLocationCoordinates('Magazyn')
        },
        {
            id: ticketIdCounter++,
            title: 'Aktualizacja oprogramowania',
            location: 'Biuro - Księgowość',
            priority: 'Medium',
            description: 'Potrzebna aktualizacja systemu księgowego',
            status: 'Open',
            createdAt: new Date('2024-12-01'),
            createdBy: 'US',
            coordinates: getLocationCoordinates('Biuro - Księgowość')
        }
    ];
    
    tickets.push(...sampleTickets);
    saveData();
    console.log('Sample tickets generated:', sampleTickets.length);
}

function updateTicketsTable() {
    const tbody = document.getElementById('ticketsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.title}</td>
            <td>${ticket.location}</td>
            <td class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>${ticket.createdBy}</td>
            <td>
                <div class="status-container">
                    <span class="status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span>
                    <div class="action-buttons">
                        ${generateActionButtons(ticket)}
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('Tickets table updated with', tickets.length, 'tickets');
}

function generateActionButtons(ticket) {
    const buttons = [];
    
    if (ticket.status === 'Open') {
        buttons.push(`
            <button class="action-btn btn-progress" onclick="changeTicketStatus(${ticket.id}, 'In Progress')" title="Rozpocznij pracę">
                🔄
            </button>
            <button class="action-btn btn-close" onclick="changeTicketStatus(${ticket.id}, 'Closed')" title="Zamknij zgłoszenie">
                ✅
            </button>
        `);
    } else if (ticket.status === 'In Progress') {
        buttons.push(`
            <button class="action-btn btn-close" onclick="changeTicketStatus(${ticket.id}, 'Closed')" title="Zamknij zgłoszenie">
                ✅
            </button>
            <button class="action-btn btn-reopen" onclick="changeTicketStatus(${ticket.id}, 'Open')" title="Otwórz ponownie">
                🔄
            </button>
        `);
    } else if (ticket.status === 'Closed') {
        buttons.push(`
            <button class="action-btn btn-reopen" onclick="changeTicketStatus(${ticket.id}, 'Open')" title="Otwórz ponownie">
                🔄
            </button>
        `);
    }
    
    return buttons.join('');
}


function changeTicketStatus(ticketId, newStatus) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
        console.error('Ticket not found:', ticketId);
        return;
    }
    
    const oldStatus = ticket.status;
    ticket.status = newStatus;
    ticket.updatedAt = new Date();
    ticket.updatedBy = currentUser ? currentUser.initials : 'System';
    
    // Zapisz zmiany
    saveData();
    
    // Aktualizuj interfejs
    updateTicketsTable();
    updateHeatmap(); // Aktualizuj heatmapę
    
    // Pokaż komunikat
    showMessage('successMessage', `Zgłoszenie #${ticketId} zmieniono z "${oldStatus}" na "${newStatus}"`, 3000);
    
    console.log(`Ticket ${ticketId} status changed from "${oldStatus}" to "${newStatus}"`);
}


function filterTickets(type) {

    document.querySelectorAll('.list-item').forEach(item => {
        item.classList.remove('active');
    });
    

    event.target.classList.add('active');
    
    const tbody = document.getElementById('ticketsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let filteredTickets = [];
    
    switch(type) {
        case 'active':
            filteredTickets = tickets.filter(ticket => ticket.status === 'Open');
            break;
        case 'closed':
            filteredTickets = tickets.filter(ticket => ticket.status === 'Closed');
            break;
        case 'in_progress':
            filteredTickets = tickets.filter(ticket => ticket.status === 'In Progress');
            break;
        case 'my':
            filteredTickets = tickets.filter(ticket => 
                currentUser && ticket.createdBy === currentUser.initials
            );
            break;
        default:
            filteredTickets = tickets;
    }
    

    const headerMap = {
        'active': 'Zgłoszenia aktywne',
        'closed': 'Zgłoszenia zakończone', 
        'in_progress': 'Zgłoszenia w trakcie',
        'my': 'Twoje zgłoszenia'
    };
    
    const header = document.querySelector('#ticketsPage h2');
    if (header) {
        header.textContent = headerMap[type] || 'Wszystkie zgłoszenia';
    }
    
  
    filteredTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.title}</td>
            <td>${ticket.location}</td>
            <td class="priority-${ticket.priority.toLowerCase()}">${ticket.priority}</td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>${ticket.createdBy}</td>
            <td>
                <div class="status-container">
                    <span class="status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span>
                    <div class="action-buttons">
                        ${generateActionButtons(ticket)}
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    

    if (filteredTickets.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                Brak zgłoszeń w tej kategorii
            </td>
        `;
        tbody.appendChild(row);
    }
    
    console.log('Filtered tickets by:', type, 'Found:', filteredTickets.length);
}


function showMessage(elementId, message, duration = 3000) {

    let element = document.getElementById(elementId);
    
    if (!element) {

        element = document.createElement('div');
        element.className = 'flash-message temp-message';
        element.style.position = 'fixed';
        element.style.top = '20px';
        element.style.right = '20px';
        element.style.zIndex = '9999';
        element.style.maxWidth = '400px';
        document.body.appendChild(element);
    }
    
    element.textContent = message;
    element.classList.remove('hidden');
    
    setTimeout(() => {
        element.classList.add('hidden');

        if (element.classList.contains('temp-message')) {
            setTimeout(() => element.remove(), 300);
        }
    }, duration);
}

function searchTickets(query) {
    const rows = document.querySelectorAll('#ticketsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const show = text.includes(query.toLowerCase());
        row.style.display = show ? '' : 'none';
    });
    
    console.log('Search query:', query);
}

function updateHeatmap() {
    const activeTab = document.querySelector('#heatmapPage .hall-tab.active');
    const currentHall = activeTab ? activeTab.textContent : 'Hala1';
    
    updateHeatmapForHall(currentHall);
}

function updateHeatmapForHall(hallName) {
    let canvasId = 'heatmapCanvas1';
    if (hallName === 'Hala2') canvasId = 'heatmapCanvas2';
    else if (hallName === 'Hala3') canvasId = 'heatmapCanvas3';
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    canvas.querySelectorAll('.heat-point').forEach(point => point.remove());
    
    const hallTickets = tickets.filter(ticket => {
        if (!ticket.coordinates) return false;
        const coords = getLocationCoordinates(ticket.location);
        return coords.hall === hallName && ticket.status === 'Open';
    });
    
    hallTickets.forEach(ticket => {
        const heatPoint = document.createElement('div');
        heatPoint.className = 'heat-point';
        
        const intensity = getPriorityIntensity(ticket.priority);
        const size = 30 + intensity * 5;
        
        heatPoint.style.left = (ticket.coordinates.x - size/2) + 'px';
        heatPoint.style.top = (ticket.coordinates.y - size/2) + 'px';
        heatPoint.style.width = size + 'px';
        heatPoint.style.height = size + 'px';
        
        if (ticket.priority === 'High') {
            heatPoint.style.background = 'radial-gradient(circle, rgba(255, 0, 0, 0.8) 0%, rgba(255, 100, 0, 0.4) 50%, transparent 100%)';
        } else if (ticket.priority === 'Medium') {
            heatPoint.style.background = 'radial-gradient(circle, rgba(255, 165, 0, 0.8) 0%, rgba(255, 200, 0, 0.4) 50%, transparent 100%)';
        } else {
            heatPoint.style.background = 'radial-gradient(circle, rgba(0, 255, 0, 0.6) 0%, rgba(100, 255, 100, 0.3) 50%, transparent 100%)';
        }
        
        heatPoint.title = `${ticket.title} (${ticket.priority}) - ${ticket.location}`;
        
        canvas.appendChild(heatPoint);
    });
    
    console.log('Heatmap updated for', hallName, 'with', hallTickets.length, 'points');
}

function switchHeatmapHall(hallName) {
    document.querySelectorAll('#heatmapPage .hall-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('[id^="heatmapCanvas"]').forEach(canvas => {
        canvas.style.display = 'none';
    });
    
    let canvasId = 'heatmapCanvas1'; 
    if (hallName === 'Hala2') {
        canvasId = 'heatmapCanvas2';
    } else if (hallName === 'Hala3') {
        canvasId = 'heatmapCanvas3';
    }
    
    document.getElementById(canvasId).style.display = 'block';
    
    document.getElementById('currentHall').textContent = hallName;
    
    updateHeatmapForHall(hallName);
    
    console.log('Switched to hall:', hallName);
}

function getPriorityIntensity(priority) {
    const priorityMap = {
        'High': 10,
        'Medium': 5,
        'Low': 2
    };
    return priorityMap[priority] || 1;
}

function updateAnalytics() {
    switchAnalyticsHall('Hala1');
}

function switchAnalyticsHall(hallName) {
    document.querySelectorAll('#analyticsPage .hall-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    generateAnalyticsContent(hallName);
    
    console.log('Analytics switched to:', hallName);
}

function generateAnalyticsContent(hallName) {
    const analyticsContent = document.getElementById('analyticsContent');
    if (!analyticsContent) return;
    
    const analyticsData = getAnalyticsData(hallName);
    
    analyticsContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${analyticsData.topLocation}</div>
                <div class="stat-label">Najwięcej otwartych zgłoszeń</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analyticsData.topClosed}</div>
                <div class="stat-label">Najwięcej zamkniętych zgłoszeń</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${analyticsData.totalArea}</div>
                <div class="stat-label">Najwięcej zgłoszeń (ogółem)</div>
            </div>
        </div>
        
        <div class="analytics-container">
            <div class="analytics-card">
                <h3>Zgłoszenia - ${hallName}</h3>
                <div class="chart-container">
                    ${generateChartBars(analyticsData.chartData)}
                </div>
            </div>
            
            <div class="analytics-card">
                <h3>Grupy Incydentów - ${hallName}</h3>
                <ul class="incident-groups">
                    ${generateIncidentGroups(analyticsData.groups)}
                </ul>
            </div>
        </div>
        
        <div class="analytics-card">
            <h3>Statystyki miesięczne - ${hallName}</h3>
            <div class="monthly-stats">
                ${generateMonthlyStats(analyticsData.monthlyData)}
            </div>
        </div>
    `;
}

function getAnalyticsData(hallName) {
    const standardGroups = [
        { icon: '⚡', name: 'Utrzymanie_ruchu_elektronicy', email: 'URE@firma.com' },
        { icon: '🔧', name: 'Utrzymanie_ruchu_mechanicy', email: 'URM@firma.com' },
        { icon: '🖥️', name: 'IT_technicy', email: 'IT@firma.com' },
        { icon: '🌐', name: 'IT_network_team', email: 'ITN@firma.com' },
        { icon: '💾', name: 'IT_software_team', email: 'ITS@firma.com' }
    ];

    const data = {
        'Hala1': {
            topLocation: 'IT_technicy',
            topClosed: 'IT_network_team', 
            totalArea: 'IT_technicy',
            chartData: [45, 65, 80, 55, 70, 85],
            groups: standardGroups,
            monthlyData: [
                { month: 'Styczeń', count: 12, change: '+15%' },
                { month: 'Luty', count: 18, change: '+50%' },
                { month: 'Marzec', count: 15, change: '-16%' },
                { month: 'Kwiecień', count: 22, change: '+47%' },
                { month: 'Maj', count: 19, change: '-14%' },
                { month: 'Czerwiec', count: 25, change: '+32%' }
            ]
        },
        'Hala2': {
            topLocation: 'Utrzymanie_ruchu_mechanicy',
            topClosed: 'IT_technicy',
            totalArea: 'Utrzymanie_ruchu_elektronicy',
            chartData: [70, 90, 85, 75, 95, 80],
            groups: standardGroups,
            monthlyData: [
                { month: 'Styczeń', count: 35, change: '+25%' },
                { month: 'Luty', count: 42, change: '+20%' },
                { month: 'Marzec', count: 38, change: '-10%' },
                { month: 'Kwiecień', count: 48, change: '+26%' },
                { month: 'Maj', count: 52, change: '+8%' },
                { month: 'Czerwiec', count: 45, change: '-13%' }
            ]
        },
        'Hala3': {
            topLocation: 'IT_software_team',
            topClosed: 'Utrzymanie_ruchu_mechanicy',
            totalArea: 'IT_network_team',
            chartData: [55, 65, 75, 60, 70, 80],
            groups: standardGroups,
            monthlyData: [
                { month: 'Styczeń', count: 8, change: '+30%' },
                { month: 'Luty', count: 12, change: '+50%' },
                { month: 'Marzec', count: 15, change: '+25%' },
                { month: 'Kwiecień', count: 18, change: '+20%' },
                { month: 'Maj', count: 14, change: '-22%' },
                { month: 'Czerwiec', count: 22, change: '+57%' }
            ]
        },
        'ALL': {
            topLocation: 'IT_technicy',
            topClosed: 'IT_network_team',
            totalArea: 'IT_technicy',
            chartData: [60, 85, 90, 70, 85, 95],
            groups: standardGroups,
            monthlyData: [
                { month: 'Styczeń', count: 55, change: '+22%' },
                { month: 'Luty', count: 72, change: '+31%' },
                { month: 'Marzec', count: 68, change: '-6%' },
                { month: 'Kwiecień', count: 88, change: '+29%' },
                { month: 'Maj', count: 85, change: '-3%' },
                { month: 'Czerwiec', count: 92, change: '+8%' }
            ]
        }
    };
    
    return data[hallName] || data['Hala1'];
}

function generateChartBars(data) {
    return data.map(height => 
        `<div class="chart-bar" style="height: ${height}%;"></div>`
    ).join('');
}

function generateIncidentGroups(groups) {
    return groups.map(group => `
        <li>
            <span class="group-icon">${group.icon}</span>
            <div class="group-info">
                <div class="group-name">${group.name}</div>
                <div class="group-email">${group.email}</div>
            </div>
        </li>
    `).join('');
}

function generateMonthlyStats(data) {
    return data.map(item => `
        <div class="monthly-item">
            <span>${item.month}</span>
            <span><strong>${item.count}</strong> ${item.change}</span>
        </div>
    `).join('');
}

function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('pl-PL');
}

function globalSearch(query) {
    console.log('Global search:', query);
}

function toggleFilter() {
    console.log('Toggle filter');
}

function toggleView(viewType) {
    console.log('Toggle view to:', viewType);
}

function saveData() {
    try {
        localStorage.setItem('gitdesk_tickets', JSON.stringify(tickets));
        localStorage.setItem('gitdesk_counter', ticketIdCounter.toString());
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData() {
    try {
        const savedTickets = localStorage.getItem('gitdesk_tickets');
        const savedCounter = localStorage.getItem('gitdesk_counter');
        
        if (savedTickets) {
            tickets = JSON.parse(savedTickets);
            console.log('Loaded tickets from localStorage:', tickets.length);
        }
        
        if (savedCounter) {
            ticketIdCounter = parseInt(savedCounter);
            console.log('Loaded counter from localStorage:', ticketIdCounter);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function exportData() {
    const dataStr = JSON.stringify(tickets, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gitdesk_data.json';
    link.click();
    console.log('Data exported');
}

setInterval(() => {

}, 30000);

console.log('GitDesk JavaScript loaded successfully!');