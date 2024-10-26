// VoIP Monitoring Dashboard
class VoIPMonitoring {
    constructor() {
        this.charts = {};
        this.updateInterval = 5000; // 5 seconden
        this.initialize();
    }

    async initialize() {
        this.initializeCharts();
        this.startMonitoring();
        await this.loadInitialData();
    }

    initializeCharts() {
        // Gesprekken Chart
        const callsCtx = document.getElementById('callsChart').getContext('2d');
        this.charts.calls = new Chart(callsCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${23-i}u`).reverse(),
                datasets: [{
                    label: 'Gesprekken',
                    data: [],
                    borderColor: '#4CAF50',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

        // Andere charts initialiseren...
    }

    startMonitoring() {
        setInterval(() => {
            this.updateServerStatus();
            this.updateConnections();
            this.updateEvents();
        }, this.updateInterval);
    }

    async loadInitialData() {
        try {
            const [serverStatus, connections, events] = await Promise.all([
                this.fetchServerStatus(),
                this.fetchConnections(),
                this.fetchEvents()
            ]);

            this.updateUI(serverStatus, connections, events);
        } catch (error) {
            console.error('Fout bij laden data:', error);
            this.showError('Kan monitoring data niet laden');
        }
    }

    async updateServerStatus() {
        try {
            const status = await this.fetchServerStatus();
            
            // Update primaire server
            const primaryStatus = document.getElementById('primaryStatus');
            primaryStatus.className = `status-badge ${status.primary.status}`;
            primaryStatus.textContent = this.getStatusText(status.primary.status);
            
            document.getElementById('primaryLatency').textContent = 
                `${status.primary.latency}ms`;
            document.getElementById('primaryConnections').textContent = 
                status.primary.connections;

            // Update backup server
            const backupStatus = document.getElementById('backupStatus');
            backupStatus.className = `status-badge ${status.backup.status}`;
            backupStatus.textContent = this.getStatusText(status.backup.status);
            
            document.getElementById('backupLatency').textContent = 
                `${status.backup.latency}ms`;
            document.getElementById('backupConnections').textContent = 
                status.backup.connections;

        } catch (error) {
            console.error('Fout bij updaten server status:', error);
        }
    }

    async updateConnections() {
        try {
            const connections = await this.fetchConnections();
            const container = document.getElementById('activeConnections');
            
            container.innerHTML = connections.map(conn => `
                <div class="connection-item">
                    <div class="connection-info">
                        <div class="connection-id">${conn.id}</div>
                        <div class="connection-details">
                            ${conn.source} → ${conn.destination}
                        </div>
                    </div>
                    <div class="connection-stats">
                        <span class="duration">${conn.duration}</span>
                        <span class="quality ${this.getQualityClass(conn.quality)}">
                            ${conn.quality}%
                        </span>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Fout bij updaten verbindingen:', error);
        }
    }

    async updateEvents() {
        try {
            const events = await this.fetchEvents();
            const container = document.getElementById('recentEvents');
            
            container.innerHTML = events.map(event => `
                <div class="event-item ${event.type}">
                    <div class="event-time">${event.time}</div>
                    <div class="event-message">${event.message}</div>
                    <div class="event-status">${event.status}</div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Fout bij updaten events:', error);
        }
    }

    // Helper functies
    getStatusText(status) {
        const statusTexts = {
            active: 'Actief',
            standby: 'Standby',
            error: 'Fout'
        };
        return statusTexts[status] || status;
    }

    getQualityClass(quality) {
        if (quality >= 90) return 'excellent';
        if (quality >= 75) return 'good';
        if (quality >= 60) return 'fair';
        return 'poor';
    }

    // Mock data fetching (vervang door echte API calls)
    async fetchServerStatus() {
        // Simuleer API call
        return {
            primary: {
                status: 'active',
                latency: 23,
                connections: 47,
                cpu: 45,
                memory: 60
            },
            backup: {
                status: 'standby',
                latency: 28,
                connections: 0,
                cpu: 15,
                memory: 25
            }
        };
    }

    async fetchConnections() {
        // Simuleer API call
        return [
            {
                id: 'CALL001',
                source: '+31612345678',
                destination: '+31687654321',
                duration: '04:23',
                quality: 98
            },
            // Meer verbindingen...
        ];
    }

    async fetchEvents() {
        // Simuleer API call
        return [
            {
                time: '14:23:45',
                type: 'info',
                message: 'Server health check OK',
                status: 'success'
            },
            // Meer events...
        ];
    }

    showError(message) {
        // Implementeer error weergave
        console.error(message);
    }
}

// Initialize monitoring when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voipMonitoring = new VoIPMonitoring();
});