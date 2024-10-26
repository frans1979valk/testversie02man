// Camera statistieken beheer
class CameraStatistics {
    constructor() {
        this.cameras = new Map();
        this.users = new Map();
        this.permissions = new Map();
        this.initialize();
    }

    async initialize() {
        await this.loadData();
        this.setupEventListeners();
        this.renderStatistics();
        this.renderComparison();
        this.renderDoorbells();
        this.renderPermissions();
    }

    async loadData() {
        // Laad camera data
        const cameras = await this.fetchCameraData();
        cameras.forEach(cam => this.cameras.set(cam.id, cam));

        // Laad gebruikers
        const users = await this.fetchUsers();
        users.forEach(user => this.users.set(user.id, user));

        // Laad permissies
        const permissions = await this.fetchPermissions();
        permissions.forEach(perm => this.permissions.set(perm.id, perm));
    }

    renderStatistics() {
        // Meest betrouwbare camera
        const reliable = this.getMostReliableCamera();
        document.getElementById('reliableCamera').innerHTML = `
            <div class="camera-stat">
                <h4>${reliable.name}</h4>
                <div class="rating">
                    ${this.generateStars(reliable.reliability)}
                </div>
                <p>${reliable.uptime}% uptime</p>
            </div>
        `;

        // Beste beeldkwaliteit
        const quality = this.getBestQualityCamera();
        document.getElementById('qualityCamera').innerHTML = `
            <div class="camera-stat">
                <h4>${quality.name}</h4>
                <div class="rating">
                    ${this.generateStars(quality.quality)}
                </div>
                <p>${quality.resolution}</p>
            </div>
        `;

        // Meest gebruiksvriendelijk
        const usability = this.getMostUsableCamera();
        document.getElementById('usabilityCamera').innerHTML = `
            <div class="camera-stat">
                <h4>${usability.name}</h4>
                <div class="rating">
                    ${this.generateStars(usability.usability)}
                </div>
                <p>${usability.setupTime} min. installatie</p>
            </div>
        `;
    }

    renderComparison() {
        const tbody = document.getElementById('comparisonBody');
        tbody.innerHTML = Array.from(this.cameras.values())
            .map(camera => `
                <tr>
                    <td>${camera.name}</td>
                    <td>${this.generateStars(camera.reliability)}</td>
                    <td>${this.generateStars(camera.quality)}</td>
                    <td>${this.generateStars(camera.usability)}</td>
                    <td>${this.generateStars(camera.connectivity)}</td>
                    <td>${this.generateStars(camera.valueForMoney)}</td>
                </tr>
            `).join('');
    }

    renderDoorbells() {
        const grid = document.getElementById('doorbellGrid');
        const doorbells = Array.from(this.cameras.values())
            .filter(cam => cam.type === 'doorbell');

        grid.innerHTML = doorbells.map(doorbell => `
            <div class="doorbell-card">
                <h3>${doorbell.name}</h3>
                <div class="doorbell-stats">
                    <div class="stat-row">
                        <span>Betrouwbaarheid:</span>
                        <div class="rating">
                            ${this.generateStars(doorbell.reliability)}
                        </div>
                    </div>
                    <div class="stat-row">
                        <span>Video Kwaliteit:</span>
                        <div class="rating">
                            ${this.generateStars(doorbell.quality)}
                        </div>
                    </div>
                    <div class="stat-row">
                        <span>Audio Kwaliteit:</span>
                        <div class="rating">
                            ${this.generateStars(doorbell.audioQuality)}
                        </div>
                    </div>
                </div>
                <div class="doorbell-features">
                    <span class="badge">Bewegingsdetectie</span>
                    <span class="badge">Nachtzicht</span>
                    <span class="badge">2-weg Audio</span>
                </div>
            </div>
        `).join('');
    }

    renderPermissions() {
        const tbody = document.getElementById('permissionsBody');
        tbody.innerHTML = Array.from(this.permissions.values())
            .map(permission => {
                const user = this.users.get(permission.userId);
                const camera = this.cameras.get(permission.cameraId);
                return `
                    <tr>
                        <td>${user?.name || 'Onbekend'}</td>
                        <td>${camera?.name || 'Onbekend'}</td>
                        <td>
                            ${permission.rights.map(right => 
                                `<span class="badge">${this.getRightLabel(right)}</span>`
                            ).join(' ')}
                        </td>
                        <td>
                            <button onclick="editPermissions('${permission.id}')"
                                    class="btn-secondary">Bewerken</button>
                            <button onclick="deletePermissions('${permission.id}')"
                                    class="btn-danger">Verwijderen</button>
                        </td>
                    </tr>
                `;
            }).join('');
    }

    generateStars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    getRightLabel(right) {
        const labels = {
            view: 'Bekijken',
            record: 'Opnemen',
            share: 'Delen'
        };
        return labels[right] || right;
    }

    // Helper functies voor camera statistieken
    getMostReliableCamera() {
        return Array.from(this.cameras.values())
            .sort((a, b) => b.reliability - a.reliability)[0];
    }

    getBestQualityCamera() {
        return Array.from(this.cameras.values())
            .sort((a, b) => b.quality - a.quality)[0];
    }

    getMostUsableCamera() {
        return Array.from(this.cameras.values())
            .sort((a, b) => b.usability - a.usability)[0];
    }

    // Mock data fetching (vervang door echte API calls)
    async fetchCameraData() {
        return [
            {
                id: 'cam1',
                name: 'Ring Video Doorbell Pro',
                type: 'doorbell',
                reliability: 5,
                quality: 4,
                usability: 5,
                connectivity: 4,
                valueForMoney: 4,
                uptime: 99.5,
                resolution: '1080p HD',
                setupTime: 15,
                audioQuality: 4
            },
            // Meer camera's...
        ];
    }

    async fetchUsers() {
        return [
            {
                id: 'user1',
                name: 'Jan Smit',
                email: 'jan@example.com'
            },
            // Meer gebruikers...
        ];
    }

    async fetchPermissions() {
        return [
            {
                id: 'perm1',
                userId: 'user1',
                cameraId: 'cam1',
                rights: ['view', 'record']
            },
            // Meer permissies...
        ];
    }
}

// Initialize statistics
const cameraStats = new CameraStatistics();

// Helper functies voor modal
function showPermissionsModal() {
    document.getElementById('permissionsModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('permissionsModal').style.display = 'none';
}

function editPermissions(permissionId) {
    // Implementeer permissie bewerking
    showPermissionsModal();
}

function deletePermissions(permissionId) {
    if (confirm('Weet je zeker dat je deze rechten wilt verwijderen?')) {
        // Implementeer permissie verwijdering
    }
}