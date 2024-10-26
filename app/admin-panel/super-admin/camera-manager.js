// Camera beheer functionaliteit
class CameraManager {
    constructor() {
        this.cameras = new Map();
        this.initialize();
    }

    async initialize() {
        this.setupEventListeners();
        await this.loadCameras();
        this.renderCameraList();
    }

    setupEventListeners() {
        document.getElementById('addCameraForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addCamera();
        });
    }

    async addCamera() {
        const formData = {
            name: document.getElementById('cameraName').value,
            ipAddress: document.getElementById('ipAddress').value,
            port: parseInt(document.getElementById('port').value),
            type: document.getElementById('cameraType').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        try {
            const camera = await IPCameraService.getInstance().addCamera(formData);
            this.cameras.set(camera.id, camera);
            this.renderCameraList();
            this.showSuccess('Camera succesvol toegevoegd');
        } catch (error) {
            this.showError('Fout bij toevoegen camera: ' + error.message);
        }
    }

    async loadCameras() {
        const cameras = IPCameraService.getInstance().cameras;
        cameras.forEach(camera => {
            this.cameras.set(camera.id, camera);
        });
    }

    renderCameraList() {
        const container = document.getElementById('cameraList');
        container.innerHTML = Array.from(this.cameras.values())
            .map(camera => this.createCameraCard(camera))
            .join('');
    }

    createCameraCard(camera) {
        return `
            <div class="camera-card">
                <div class="camera-header">
                    <h3>${camera.name}</h3>
                    <span class="camera-status">${camera.enabled ? 'Actief' : 'Inactief'}</span>
                </div>
                <div class="camera-content">
                    <div class="camera-info">
                        <div class="info-item">
                            <span>IP Adres:</span>
                            <span>${camera.ipAddress}</span>
                        </div>
                        <div class="info-item">
                            <span>Type:</span>
                            <span>${camera.type.toUpperCase()}</span>
                        </div>
                        <div class="info-item">
                            <span>Status:</span>
                            <span class="status-badge ${camera.enabled ? 'online' : 'offline'}">
                                ${camera.enabled ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <div class="camera-actions">
                        <button onclick="showPreview('${camera.id}')" class="btn-secondary">
                            Preview
                        </button>
                        <button onclick="toggleCamera('${camera.id}')" class="btn-primary">
                            ${camera.enabled ? 'Uitschakelen' : 'Inschakelen'}
                        </button>
                        <button onclick="deleteCamera('${camera.id}')" class="btn-danger">
                            Verwijderen
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async showPreview(cameraId) {
        try {
            const camera = this.cameras.get(cameraId);
            if (!camera) return;

            const modal = document.getElementById('previewModal');
            const previewImage = document.getElementById('previewImage');
            
            modal.style.display = 'block';
            previewImage.src = await IPCameraService.getInstance().getSnapshot(cameraId);
        } catch (error) {
            this.showError('Kan preview niet laden: ' + error.message);
        }
    }

    async toggleCamera(cameraId) {
        const camera = this.cameras.get(cameraId);
        if (!camera) return;

        camera.enabled = !camera.enabled;
        await this.saveCameras();
        this.renderCameraList();
    }

    async deleteCamera(cameraId) {
        if (confirm('Weet je zeker dat je deze camera wilt verwijderen?')) {
            this.cameras.delete(cameraId);
            await this.saveCameras();
            this.renderCameraList();
        }
    }

    async saveCameras() {
        const cameras = Array.from(this.cameras.values());
        localStorage.setItem('ip_cameras', JSON.stringify(cameras));
    }

    showSuccess(message) {
        alert(message); // In productie: Gebruik mooiere notificatie
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Gebruik mooiere notificatie
    }
}

// Initialize camera manager
const cameraManager = new CameraManager();

// Helper functies voor modal
function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
}

function refreshPreview() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage.src) {
        previewImage.src = previewImage.src.split('?')[0] + '?t=' + Date.now();
    }
}