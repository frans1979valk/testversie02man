// Distributie Gebruikers Manager
class DistributionUsersManager {
    constructor() {
        this.users = [];
        this.currentDistribution = null;
        this.initialize();
    }

    async initialize() {
        await this.loadUsers();
        this.setupEventListeners();
        this.renderUsers();
    }

    async loadUsers() {
        try {
            const savedUsers = localStorage.getItem('distribution_users');
            this.users = savedUsers ? JSON.parse(savedUsers) : [];

            if (this.users.length === 0) {
                // Voorbeeld gebruikers voor demo
                this.users = [
                    {
                        id: 'user1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone: '+31612345678',
                        level: 'vip1',
                        status: 'active',
                        limits: {
                            calls: 25,
                            sms: 50
                        },
                        usage: {
                            calls: 10,
                            sms: 15
                        },
                        notes: 'VIP klant sinds januari 2024',
                        lastActive: '2024-03-24T10:30:00'
                    },
                    // Meer voorbeeld gebruikers...
                ];
                await this.saveUsers();
            }
        } catch (error) {
            console.error('Fout bij laden gebruikers:', error);
            this.showError('Fout bij laden gebruikers');
        }
    }

    renderUsers() {
        const container = document.getElementById('userCards');
        container.innerHTML = this.users.map(user => this.createUserCard(user)).join('');
    }

    createUserCard(user) {
        const callUsagePercent = (user.usage.calls / user.limits.calls) * 100;
        const smsUsagePercent = (user.usage.sms / user.limits.sms) * 100;

        return `
            <div class="user-card" data-id="${user.id}">
                <div class="user-header">
                    <h3>${user.name}</h3>
                    <span class="user-status">${user.status === 'active' ? 'Actief' : 'Inactief'}</span>
                </div>
                <div class="user-content">
                    <div class="user-info">
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span>${user.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Telefoon:</span>
                            <span>${user.phone}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">VIP Niveau:</span>
                            <span>${this.getVipLevelName(user.level)}</span>
                        </div>
                    </div>

                    <div class="usage-stats">
                        <div class="usage-item ${this.getUsageClass(callUsagePercent)}">
                            <div class="usage-header">
                                <span>Belminuten</span>
                                <span>${user.usage.calls}/${user.limits.calls}</span>
                            </div>
                            <div class="usage-bar">
                                <div class="usage-progress" style="width: ${callUsagePercent}%"></div>
                            </div>
                        </div>
                        <div class="usage-item ${this.getUsageClass(smsUsagePercent)}">
                            <div class="usage-header">
                                <span>SMS</span>
                                <span>${user.usage.sms}/${user.limits.sms}</span>
                            </div>
                            <div class="usage-bar">
                                <div class="usage-progress" style="width: ${smsUsagePercent}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="notes-section">
                        <h4>Notities</h4>
                        <p class="notes-content">${user.notes || 'Geen notities'}</p>
                    </div>

                    <div class="user-actions">
                        <button onclick="usersManager.editUser('${user.id}')" class="btn-icon">
                            <i class="icon-edit"></i>
                        </button>
                        <button onclick="usersManager.resetLimits('${user.id}')" class="btn-icon">
                            <i class="icon-refresh"></i>
                        </button>
                        <button onclick="usersManager.toggleStatus('${user.id}')" 
                                class="btn-icon ${user.status === 'active' ? 'warning' : 'success'}">
                            <i class="icon-power"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getVipLevelName(level) {
        const levels = {
            vip1: 'VIP Niveau 1',
            vip2: 'VIP Niveau 2',
            vip3: 'VIP Niveau 3'
        };
        return levels[level] || level;
    }

    getUsageClass(percentage) {
        if (percentage >= 90) return 'critical';
        if (percentage >= 75) return 'warning';
        return '';
    }

    async addUser(userData) {
        const newUser = {
            id: 'user_' + Date.now(),
            status: 'active',
            usage: { calls: 0, sms: 0 },
            lastActive: new Date().toISOString(),
            ...userData
        };

        this.users.push(newUser);
        await this.saveUsers();
        this.renderUsers();
    }

    async editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        // Toon edit modal met gebruikersgegevens
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone;
        document.getElementById('userLevel').value = user.level;
        document.getElementById('callLimit').value = user.limits.calls;
        document.getElementById('smsLimit').value = user.limits.sms;
        document.getElementById('userNotes').value = user.notes || '';

        const modal = document.getElementById('newUserModal');
        modal.dataset.editId = userId;
        modal.style.display = 'block';
    }

    async resetLimits(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        user.usage = { calls: 0, sms: 0 };
        await this.saveUsers();
        this.renderUsers();
    }

    async toggleStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        user.status = user.status === 'active' ? 'inactive' : 'active';
        await this.saveUsers();
        this.renderUsers();
    }

    async saveUsers() {
        try {
            localStorage.setItem('distribution_users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Fout bij opslaan gebruikers:', error);
            throw error;
        }
    }

    setupEventListeners() {
        document.getElementById('newUserForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                phone: document.getElementById('userPhone').value,
                level: document.getElementById('userLevel').value,
                limits: {
                    calls: parseInt(document.getElementById('callLimit').value),
                    sms: parseInt(document.getElementById('smsLimit').value)
                },
                notes: document.getElementById('userNotes').value
            };

            const modal = document.getElementById('newUserModal');
            if (modal.dataset.editId) {
                // Bewerken bestaande gebruiker
                await this.updateUser(modal.dataset.editId, formData);
            } else {
                // Nieuwe gebruiker toevoegen
                await this.addUser(formData);
            }

            closeModal('newUserModal');
        });
    }

    async updateUser(userId, userData) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index === -1) return;

        this.users[index] = {
            ...this.users[index],
            ...userData,
            lastUpdate: new Date().toISOString()
        };

        await this.saveUsers();
        this.renderUsers();
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Vervang door mooiere notificatie
    }
}

// Initialize users manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.usersManager = new DistributionUsersManager();
});