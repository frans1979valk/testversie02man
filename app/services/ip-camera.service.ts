import { Observable } from '@nativescript/core';
import { ErrorHandlingService } from './error-handling.service';

export interface IPCamera {
    id: string;
    name: string;
    ipAddress: string;
    port: number;
    username: string;
    password: string;
    type: 'rtsp' | 'http' | 'onvif';
    enabled: boolean;
    streamUrl?: string;
    snapshotUrl?: string;
}

export class IPCameraService extends Observable {
    private static instance: IPCameraService;
    private _cameras: Map<string, IPCamera> = new Map();
    private _activeStreams: Map<string, any> = new Map();
    private _isInitialized: boolean = false;

    private constructor() {
        super();
        this.initialize();
    }

    static getInstance(): IPCameraService {
        if (!IPCameraService.instance) {
            IPCameraService.instance = new IPCameraService();
        }
        return IPCameraService.instance;
    }

    private async initialize() {
        try {
            await this.loadCameras();
            this._isInitialized = true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Camera Initialisatie Fout',
                message: 'Kan camera service niet initialiseren',
                isCritical: false
            });
        }
    }

    async addCamera(camera: Omit<IPCamera, 'id'>): Promise<IPCamera> {
        try {
            const newCamera: IPCamera = {
                ...camera,
                id: 'cam_' + Date.now(),
                enabled: true
            };

            // Test verbinding
            await this.testConnection(newCamera);

            // Genereer stream URLs
            newCamera.streamUrl = this.generateStreamUrl(newCamera);
            newCamera.snapshotUrl = this.generateSnapshotUrl(newCamera);

            this._cameras.set(newCamera.id, newCamera);
            await this.saveCameras();

            return newCamera;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Camera Toevoegen Fout',
                message: 'Kan camera niet toevoegen',
                isCritical: false
            });
            throw error;
        }
    }

    async startStream(cameraId: string): Promise<string> {
        const camera = this._cameras.get(cameraId);
        if (!camera || !camera.enabled) {
            throw new Error('Camera niet beschikbaar');
        }

        try {
            // Start stream en return stream URL
            return camera.streamUrl;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Stream Fout',
                message: 'Kan camera stream niet starten',
                isCritical: false
            });
            throw error;
        }
    }

    async stopStream(cameraId: string): Promise<void> {
        const stream = this._activeStreams.get(cameraId);
        if (stream) {
            // Stop stream
            this._activeStreams.delete(cameraId);
        }
    }

    async getSnapshot(cameraId: string): Promise<string> {
        const camera = this._cameras.get(cameraId);
        if (!camera || !camera.enabled) {
            throw new Error('Camera niet beschikbaar');
        }

        try {
            // Haal snapshot URL op
            return camera.snapshotUrl;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Snapshot Fout',
                message: 'Kan geen snapshot maken',
                isCritical: false
            });
            throw error;
        }
    }

    private async testConnection(camera: IPCamera): Promise<boolean> {
        try {
            // Test camera verbinding
            const testUrl = this.generateSnapshotUrl(camera);
            const response = await fetch(testUrl, {
                headers: this.getAuthHeaders(camera)
            });
            return response.ok;
        } catch (error) {
            throw new Error('Kan geen verbinding maken met camera');
        }
    }

    private generateStreamUrl(camera: IPCamera): string {
        switch (camera.type) {
            case 'rtsp':
                return `rtsp://${camera.username}:${camera.password}@${camera.ipAddress}:${camera.port}/stream`;
            case 'http':
                return `http://${camera.ipAddress}:${camera.port}/stream`;
            case 'onvif':
                return `onvif://${camera.ipAddress}:${camera.port}`;
            default:
                throw new Error('Ongeldig camera type');
        }
    }

    private generateSnapshotUrl(camera: IPCamera): string {
        switch (camera.type) {
            case 'rtsp':
            case 'http':
                return `http://${camera.ipAddress}:${camera.port}/snapshot`;
            case 'onvif':
                return `http://${camera.ipAddress}:${camera.port}/onvif/snapshot`;
            default:
                throw new Error('Ongeldig camera type');
        }
    }

    private getAuthHeaders(camera: IPCamera): Headers {
        const headers = new Headers();
        const auth = btoa(`${camera.username}:${camera.password}`);
        headers.append('Authorization', `Basic ${auth}`);
        return headers;
    }

    private async loadCameras() {
        const savedCameras = localStorage.getItem('ip_cameras');
        if (savedCameras) {
            const cameras = JSON.parse(savedCameras);
            cameras.forEach((cam: IPCamera) => {
                this._cameras.set(cam.id, cam);
            });
        }
    }

    private async saveCameras() {
        const cameras = Array.from(this._cameras.values());
        localStorage.setItem('ip_cameras', JSON.stringify(cameras));
    }

    get cameras(): IPCamera[] {
        return Array.from(this._cameras.values());
    }
}