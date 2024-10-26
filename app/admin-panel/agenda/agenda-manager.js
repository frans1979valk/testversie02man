// Agenda Manager
class AgendaManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.appointments = new Map();
        this.initialize();
    }

    async initialize() {
        await this.loadAppointments();
        this.renderCalendar();
        this.setupEventListeners();
        this.loadCustomers();
    }

    async loadAppointments() {
        try {
            // In productie: Haal afspraken op van de server
            const savedAppointments = localStorage.getItem('appointments');
            if (savedAppointments) {
                const appointments = JSON.parse(savedAppointments);
                appointments.forEach(app => {
                    const date = new Date(app.date).toDateString();
                    if (!this.appointments.has(date)) {
                        this.appointments.set(date, []);
                    }
                    this.appointments.get(date).push(app);
                });
            }
        } catch (error) {
            console.error('Fout bij laden afspraken:', error);
            this.showError('Kan afspraken niet laden');
        }
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Update maand titel
        document.getElementById('currentMonth').textContent = 
            this.currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

        // Maak kalender grid
        calendar.innerHTML = '';
        
        // Weekdagen
        const weekdays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
        weekdays.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-weekday';
            dayEl.textContent = day;
            calendar.appendChild(dayEl);
        });

        // Dagen
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay() || 7;

        // Vorige maand dagen
        for (let i = 1; i < startDay; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day prev-month';
            calendar.appendChild(dayEl);
        }

        // Huidige maand dagen
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            // Check voor afspraken
            if (this.appointments.has(date.toDateString())) {
                dayEl.classList.add('has-appointments');
            }

            // Check voor vandaag
            if (date.toDateString() === new Date().toDateString()) {
                dayEl.classList.add('today');
            }

            // Check voor geselecteerde dag
            if (date.toDateString() === this.selectedDate.toDateString()) {
                dayEl.classList.add('selected');
            }

            dayEl.addEventListener('click', () => this.selectDate(date));
            calendar.appendChild(dayEl);
        }
    }

    selectDate(date) {
        this.selectedDate = date;
        this.renderCalendar();
        this.showAppointments(date);
    }

    showAppointments(date) {
        const container = document.getElementById('dayAppointments');
        const appointments = this.appointments.get(date.toDateString()) || [];
        
        document.getElementById('selectedDate').textContent = 
            date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

        container.innerHTML = appointments.length ? appointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(app => `
                <div class="appointment-item">
                    <div class="appointment-time">${app.time}</div>
                    <div class="appointment-details">
                        <h3>${app.customer}</h3>
                        <span class="type-badge ${app.type}">${this.getTypeLabel(app.type)}</span>
                        <p>${app.address}</p>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn-icon" onclick="agendaManager.editAppointment('${app.id}')">
                            <i class="icon-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="agendaManager.deleteAppointment('${app.id}')">
                            <i class="icon-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('') : '<p class="no-appointments">Geen afspraken voor deze dag</p>';
    }

    getTypeLabel(type) {
        const types = {
            installation: 'Installatie',
            support: 'Support',
            maintenance: 'Onderhoud'
        };
        return types[type] || type;
    }

    async loadCustomers() {
        try {
            // In productie: Haal klanten op van de server
            const select = document.getElementById('customerSelect');
            select.innerHTML = `
                <option value="">Selecteer klant...</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
            `;
        } catch (error) {
            console.error('Fout bij laden klanten:', error);
        }
    }

    showNewAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        document.getElementById('appointmentDate').value = 
            this.selectedDate.toISOString().split('T')[0];
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('appointmentModal').style.display = 'none';
    }

    async saveAppointment(formData) {
        try {
            const appointment = {
                id: 'app_' + Date.now(),
                date: formData.date,
                time: formData.time,
                type: formData.type,
                customer: formData.customer,
                address: formData.address,
                notes: formData.notes
            };

            const date = new Date(formData.date).toDateString();
            if (!this.appointments.has(date)) {
                this.appointments.set(date, []);
            }
            this.appointments.get(date).push(appointment);

            // In productie: Sla op in database
            this.saveToLocalStorage();
            this.renderCalendar();
            this.showAppointments(new Date(formData.date));
            this.closeModal();
            this.showSuccess('Afspraak opgeslagen');
        } catch (error) {
            console.error('Fout bij opslaan afspraak:', error);
            this.showError('Kan afspraak niet opslaan');
        }
    }

    saveToLocalStorage() {
        const allAppointments = Array.from(this.appointments.values()).flat();
        localStorage.setItem('appointments', JSON.stringify(allAppointments));
    }

    setupEventListeners() {
        document.getElementById('appointmentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                type: document.getElementById('appointmentType').value,
                customer: document.getElementById('customerSelect').value,
                address: document.getElementById('appointmentAddress').value,
                notes: document.getElementById('appointmentNotes').value
            };
            this.saveAppointment(formData);
        });
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    showSuccess(message) {
        alert(message); // In productie: Gebruik mooiere notificatie
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Gebruik mooiere notificatie
    }
}

// Initialize agenda manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agendaManager = new AgendaManager();
});