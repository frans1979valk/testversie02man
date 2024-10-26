// Dashboard functionality
class Dashboard {
    constructor() {
        this.initializeCounters();
        this.loadTodayAppointments();
        this.loadRecentNotifications();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    initializeCounters() {
        // Status tellers ophalen en weergeven
        this.updateStatusCounters({
            completed: 0,
            notHome: 1,
            planned: 2,
            cancelled: 0
        });
    }

    updateStatusCounters(counts) {
        document.getElementById('completedCount').textContent = counts.completed;
        document.getElementById('notHomeCount').textContent = counts.notHome;
        document.getElementById('plannedCount').textContent = counts.planned;
        document.getElementById('cancelledCount').textContent = counts.cancelled;
    }

    async loadTodayAppointments() {
        const appointmentsList = document.getElementById('todayAppointments');
        appointmentsList.innerHTML = this.getLoadingSpinner();

        try {
            // In productie: Haal afspraken op van de server
            const appointments = await this.fetchTodayAppointments();
            appointmentsList.innerHTML = appointments.length > 0 
                ? this.renderAppointments(appointments)
                : '<p class="no-data">Geen afspraken voor vandaag</p>';
        } catch (error) {
            console.error('Fout bij laden afspraken:', error);
            appointmentsList.innerHTML = '<p class="error">Fout bij laden afspraken</p>';
        }
    }

    async loadRecentNotifications() {
        const notificationsList = document.getElementById('recentNotifications');
        notificationsList.innerHTML = this.getLoadingSpinner();

        try {
            // In productie: Haal meldingen op van de server
            const notifications = await this.fetchRecentNotifications();
            notificationsList.innerHTML = notifications.length > 0
                ? this.renderNotifications(notifications)
                : '<p class="no-data">Geen recente meldingen</p>';
        } catch (error) {
            console.error('Fout bij laden meldingen:', error);
            notificationsList.innerHTML = '<p class="error">Fout bij laden meldingen</p>';
        }
    }

    setupEventListeners() {
        // Event listeners voor dashboard interacties
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (action) {
                    this.handleAction(action);
                }
            });
        });
    }

    startAutoRefresh() {
        // Ververs dashboard data elke 5 minuten
        setInterval(() => {
            this.refreshDashboard();
        }, 5 * 60 * 1000);
    }

    async refreshDashboard() {
        await Promise.all([
            this.loadTodayAppointments(),
            this.loadRecentNotifications()
        ]);
    }

    // Helper methods
    getLoadingSpinner() {
        return '<div class="loading-spinner"></div>';
    }

    renderAppointments(appointments) {
        return appointments.map(appointment => `
            <div class="appointment-item">
                <div class="appointment-time">${appointment.time}</div>
                <div class="appointment-details">
                    <strong>${appointment.customerName}</strong>
                    <span>${appointment.address}</span>
                </div>
                <div class="appointment-status ${appointment.status}">
                    ${appointment.status}
                </div>
            </div>
        `).join('');
    }

    renderNotifications(notifications) {
        return notifications.map(notification => `
            <div class="notification-item ${notification.type}">
                <div class="notification-icon">
                    <i class="icon-${notification.type}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Mock data fetching (vervang door echte API calls)
    async fetchTodayAppointments() {
        return [
            {
                time: '09:00',
                customerName: 'John Doe',
                address: 'Hoofdstraat 1, Amsterdam',
                status: 'pending'
            },
            {
                time: '11:30',
                customerName: 'Jane Smith',
                address: 'Kerkweg 15, Rotterdam',
                status: 'completed'
            }
        ];
    }

    async fetchRecentNotifications() {
        return [
            {
                type: 'warning',
                message: 'Klant niet thuis: Hoofdstraat 1',
                time: '5 minuten geleden'
            },
            {
                type: 'success',
                message: 'Installatie voltooid: Kerkweg 15',
                time: '1 uur geleden'
            }
        ];
    }

    handleAction(action) {
        switch (action) {
            case 'newCustomer':
                showNewCustomerModal();
                break;
            case 'settings':
                showSettingsModal();
                break;
            default:
                console.log(`Onbekende actie: ${action}`);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});