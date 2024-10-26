// Camera overzicht management
class CameraOverviewManager {
    constructor() {
        this.distributions = new Map();
        this.selectedDistribution = null;
        this.initialize();
    }

    async initialize() {
        await this.loadDistributions();
        this.setupEventListeners();
        this.populateDistributionSelect();
        if (this.distributions.size > 0) {
            this.selectDistribution(Array.from(this.distributions.keys())[0]);
        }
    }

    async loadDistributions() {
        try {
            // In productie: Laad van API
            const distributions = JSON.parse(localStorage.getItem('distributions') || '[]');
            distributions.forEach(dist => {
                this.distributions.set(dist.id, {
                    ...dist,
                    cameraEnabled: dist.features?.cameraEnabled ?? false,
                    cameras: new Map()
                });
            });
        } catch (error) {
            console.error('Fout bij laden distributies:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('distributionSelect')?.addEventListener('change', (e) => {
            this.selectDistribution(e.target.value);
        });

        document.getElementById('cameraFeatureToggle')?.addEventListener('change', (e) => {
            this.toggleCameraFeature(e.target.checked);
        });
    }

    populateDistributionSelect() {
        const select = document.getElementById('distributionSelect');
        select.innerHTML = Array.from(this.distributions.values())
            .map(dist => `<option value="${dist.id}">${dist.name}</option>`)
            .join('');
    }

    async selectDistribution(distributionId) {
        this.selectedDistribution = this.distributions.get(distributionId);
        if (!this.selectedDistribution) return;

        // Update UI
        document.getElementById('cameraFeatureToggle').checked = 
            this.selectedDistribution.cameraEnabled;

        await this.loadDistributionCameras();
        this.updateStatistics();
        this.renderCameraGrid();
    }

    async loadDistributionCameras() {
        try {
            // In productie: Laad van API
            const cameras = await IPCameraService.getInstance()
                .getCamerasForDistribution(this.selectedDistribution.id);
            
            this.selectedDistribution.cameras = new Map(
                cameras.map(cam => [cam.id, cam])
            );
        } catch (error) {
            console.error('Fout bij laden camera\'s:', error);
        }
    }

    updateStatistics() {
        const cameras = Array.from(this.selectedDistribution.cameras.values());
        
        document.getElementById('totalCameras').textContent = cameras.length;
        document.getElementById('activeCameras').textContent = 
            cameras.filter(cam => cam.enabled).length;
        document.getElementById('onlineCameras').textContent = 
            cameras.filter(cam => cam.enabled && cam.online).length;
    }

    renderCameraGrid() {
        const grid = document.getElementById('cameraGrid');
        grid.innerHTML = Array.from(this.selectedDistribution.cameras.values())
            .map(camera => this.createCameraCard(camera))
            .join('');
    }

    createCameraCard(camera) {
        return `
            <div class="camera-card">
                <div class="camera-header">
                    <h3>${camera.name}</h3>
                    <span class="status-badge ${camera.online ? 'online' : 'offline'}">
                        ${camera.online ? 'Online' : 'Offline'}
                    </span>
                </div>
                <div class="camera-content">
                    <div class="camera-info">
                        <div class="info-row">
                            <span>Type:</span>
                            <span>${camera.type.toUpperCase()}</span>
                        </div>
                        <div class="info-row">
                            <span>Actieve Gebruikers:</span>
                            <span>${camera.activeUsers || 0}</span>
                        </div>
                    </div>
                    <div class="camera-actions">
                        <button onclick="showCameraDetails('${camera.id}')" 
                                class="btn-secondary">Details</button>
                        <button onclick="toggleCamera('${camera.id}')"
                                class="btn-primary">
                            ${camera.enabled ? 'Uitschakelen' : 'Inschakelen'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async toggleCameraFeature(enabled) {
        if (!this.selectedDistribution) return;

        try {
            this.selectedDistribution.cameraEnabled = enabled;
            await this.saveDistributionSettings();
            this.showSuccess(
                enabled ? 'Camera functionaliteit ingeschakeld' : 'Camera functionaliteit uitgeschakeld'
            );
        } catch (error) {
            this.showError('Fout bij wijzigen camera functionaliteit');
            // Reset toggle
            document.getElementById('cameraFeatureToggle').checked = !enabled;
        }
    }

    async saveDistributionSettings() {
        // In productie: Update via API
        const distributions = Array.from(this.distributions.values());
        localStorage.setItem('distributions', JSON.stringify(distributions));
    }

    showCameraDetails(cameraId) {
        const camera = this.selectedDistribution.cameras.get(cameraId);
        if (!camera) return;

        document.getElementById('detailName').textContent = camera.name;
        document.getElementById('detailIP').textContent = camera.ipAddress;
        document.getElementById('detailType').textContent = camera.type.toUpperCase();
        document.getElementById('detailLastActive').textContent = 
            camera.lastActive ? new Date(camera.lastActive).toLocaleString() : 'Nooit';
        document.getElementById('detailUsers').textContent = 
            `${camera.activeUsers || 0} actieve gebruiker(s)`;

        document.getElementById('cameraDetailsModal').style.display = 'block';
    }

    showSuccess(message) {
        alert(message); // In productie: Gebruik mooiere notificatie
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Gebruik mooiere notificatie
    }
}

// Initialize manager
const cameraOverview = new CameraOverviewManager();

// Helper functies
function closeModal() {
    document.getElementById('cameraDetailsModal').style.display = 'none';
}

async function toggleCamera(cameraId) {
    await cameraOverview.selectedDistribution?.cameras.get(cameraId)?.toggle();
    cameraOverview.renderCameraGrid();
    cameraOverview.updateStatistics();
}

function showCameraDetails(cameraId) {
    cameraOverview.showCameraDetails(cameraId);
}