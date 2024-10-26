// Dashboard Charts
class DashboardCharts {
    constructor() {
        this.charts = {};
        this.initializeCharts();
    }

    initializeCharts() {
        this.createRevenueChart();
        this.createUsageCharts();
        this.createInvoiceStatusChart();
        this.updateStatistics();
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                datasets: [{
                    label: 'Omzet',
                    data: [12000, 19000, 15000, 21000, 18000, 25000],
                    borderColor: '#B8860B',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Omzet Ontwikkeling'
                    }
                }
            }
        });
    }

    createUsageCharts() {
        // Belminuten Grafiek
        const callCtx = document.getElementById('callUsageChart').getContext('2d');
        this.charts.calls = new Chart(callCtx, {
            type: 'bar',
            data: {
                labels: ['VIP Installatie', 'Telecom Support', 'Andere'],
                datasets: [{
                    label: 'Belminuten',
                    data: [1200, 800, 400],
                    backgroundColor: '#B8860B'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Belminuten per Distributie'
                    }
                }
            }
        });

        // SMS Grafiek
        const smsCtx = document.getElementById('smsUsageChart').getContext('2d');
        this.charts.sms = new Chart(smsCtx, {
            type: 'bar',
            data: {
                labels: ['VIP Installatie', 'Telecom Support', 'Andere'],
                datasets: [{
                    label: 'SMS Berichten',
                    data: [2500, 1800, 900],
                    backgroundColor: '#4B0082'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'SMS Verbruik per Distributie'
                    }
                }
            }
        });
    }

    createInvoiceStatusChart() {
        const ctx = document.getElementById('invoiceStatusChart').getContext('2d');
        this.charts.invoices = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Betaald', 'Openstaand', 'Verlopen'],
                datasets: [{
                    data: [75, 20, 5],
                    backgroundColor: ['#4CAF50', '#FFA500', '#FF0000']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Factuur Status Verdeling'
                    }
                }
            }
        });
    }

    updateStatistics() {
        // Update statistieken in het dashboard
        document.getElementById('totalRevenue').textContent = '25,680.00';
        document.getElementById('pendingInvoices').textContent = '3,280.00';
        document.getElementById('creditBalance').textContent = '8,450.00';

        // Update top distributies tabel
        const tbody = document.getElementById('topDistributions');
        tbody.innerHTML = `
            <tr>
                <td>VIP Installatie</td>
                <td>247</td>
                <td>€ 15,280.00</td>
                <td>
                    <div class="usage-indicator">
                        <div class="usage-bar" style="width: 75%"></div>
                    </div>
                </td>
                <td><span class="status-badge success">Actief</span></td>
            </tr>
            <tr>
                <td>Telecom Support</td>
                <td>124</td>
                <td>€ 8,450.00</td>
                <td>
                    <div class="usage-indicator">
                        <div class="usage-bar" style="width: 60%"></div>
                    </div>
                </td>
                <td><span class="status-badge success">Actief</span></td>
            </tr>
        `;
    }

    refreshData() {
        // Update alle grafieken met nieuwe data
        this.charts.revenue.update();
        this.charts.calls.update();
        this.charts.sms.update();
        this.charts.invoices.update();
        this.updateStatistics();
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardCharts = new DashboardCharts();
});