import { Observable } from '@nativescript/core';
import { VoIPService } from './voip.service';
import { ErrorHandlingService } from './error-handling.service';
import { Geolocation } from '@nativescript/geolocation';

export interface EmergencyContact {
    id: string;
    name: string;
    number: string;
    priority: number;
    notifyBySMS: boolean;
}

export class EmergencyService extends Observable {
    private static instance: EmergencyService;
    private voipService: VoIPService;
    private _isEmergencyActive: boolean = false;
    private _emergencyContacts: EmergencyContact[] = [];
    private _currentEmergencyCall: any = null;

    private constructor() {
        super();
        this.voipService = VoIPService.getInstance();
        this.loadEmergencyContacts();
    }

    static getInstance(): EmergencyService {
        if (!EmergencyService.instance) {
            EmergencyService.instance = new EmergencyService();
        }
        return EmergencyService.instance;
    }

    private async loadEmergencyContacts() {
        // In productie: Laad van database/storage
        this._emergencyContacts = [
            {
                id: 'emergency1',
                name: 'Emma (Zorgverlener)',
                number: '0687654321',
                priority: 1,
                notifyBySMS: true
            },
            {
                id: 'emergency2',
                name: 'Jan (Zoon)',
                number: '0612345678',
                priority: 2,
                notifyBySMS: true
            }
        ];
    }

    async triggerEmergency(): Promise<boolean> {
        try {
            if (this._isEmergencyActive) {
                return false;
            }

            this._isEmergencyActive = true;
            this.notifyPropertyChange('isEmergencyActive', true);

            // Verkrijg locatie
            const location = await this.getCurrentLocation();

            // Sorteer contacten op prioriteit
            const sortedContacts = [...this._emergencyContacts]
                .sort((a, b) => a.priority - b.priority);

            // Verstuur nood-SMS naar alle contacten
            if (location) {
                await this.sendEmergencySMS(sortedContacts, location);
            }

            // Start noodoproep met hoogste prioriteit contact
            const primaryContact = sortedContacts[0];
            if (primaryContact) {
                this._currentEmergencyCall = await this.voipService.makeCall(primaryContact.number);
            }

            return true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Noodoproep Fout',
                message: 'Kan geen noodoproep maken',
                isCritical: true
            });
            return false;
        }
    }

    async cancelEmergency(): Promise<void> {
        if (this._currentEmergencyCall) {
            await this.voipService.endCall();
            this._currentEmergencyCall = null;
        }
        this._isEmergencyActive = false;
        this.notifyPropertyChange('isEmergencyActive', false);
    }

    private async getCurrentLocation() {
        try {
            const hasPermission = await Geolocation.requestPermission();
            if (!hasPermission) {
                return null;
            }

            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                maximumAge: 5000,
                timeout: 10000
            });

            return location;
        } catch (error) {
            console.error('Locatie fout:', error);
            return null;
        }
    }

    private async sendEmergencySMS(contacts: EmergencyContact[], location: any) {
        const message = `NOODMELDING: Hulp nodig op locatie:\n` +
            `https://maps.google.com/?q=${location.latitude},${location.longitude}\n` +
            `Neem direct contact op.`;

        for (const contact of contacts) {
            if (contact.notifyBySMS) {
                try {
                    // Implementeer SMS verzending
                    console.log(`SMS naar ${contact.number}: ${message}`);
                } catch (error) {
                    console.error('SMS fout:', error);
                }
            }
        }
    }

    get isEmergencyActive(): boolean {
        return this._isEmergencyActive;
    }

    get emergencyContacts(): EmergencyContact[] {
        return this._emergencyContacts;
    }
}