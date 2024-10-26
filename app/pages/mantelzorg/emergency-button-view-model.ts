import { Observable } from '@nativescript/core';
import { EmergencyService } from '../../services/emergency.service';

export class EmergencyButtonViewModel extends Observable {
    private emergencyService: EmergencyService;
    private _isEmergencyActive: boolean = false;
    private _emergencyMessage: string = '';

    constructor() {
        super();
        this.emergencyService = EmergencyService.getInstance();
        this.setupEmergencyService();
    }

    private setupEmergencyService() {
        this.emergencyService.on('propertyChange', (data: any) => {
            if (data.propertyName === 'isEmergencyActive') {
                this._isEmergencyActive = data.value;
                this.updateEmergencyMessage();
                this.notifyPropertyChange('isEmergencyActive', this._isEmergencyActive);
            }
        });
    }

    private updateEmergencyMessage() {
        if (this._isEmergencyActive) {
            const contact = this.emergencyService.emergencyContacts[0];
            this._emergencyMessage = `Contact wordt opgenomen met ${contact.name}.\nLocatie wordt gedeeld met hulpverleners.`;
        } else {
            this._emergencyMessage = '';
        }
        this.notifyPropertyChange('emergencyMessage', this._emergencyMessage);
    }

    async onEmergencyTap() {
        if (!this._isEmergencyActive) {
            await this.emergencyService.triggerEmergency();
        }
    }

    async cancelEmergency() {
        await this.emergencyService.cancelEmergency();
    }

    get isEmergencyActive(): boolean {
        return this._isEmergencyActive;
    }

    get emergencyMessage(): string {
        return this._emergencyMessage;
    }
}