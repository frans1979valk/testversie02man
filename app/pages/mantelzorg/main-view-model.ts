import { Observable } from '@nativescript/core';
import { VoIPService } from '../../services/voip.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

export class MantelzorgViewModel extends Observable {
    private voipService: VoIPService;
    private _recentActivity: any[] = [];
    private _contacts: any[] = [];

    constructor() {
        super();
        this.voipService = VoIPService.getInstance();
        this.loadInitialData();
    }

    private async loadInitialData() {
        // Laad opgeslagen contacten
        this._contacts = [
            {
                id: 'family1',
                name: 'Jan (Zoon)',
                number: '0612345678',
                type: 'family',
                photo: '~/images/contacts/jan.jpg'
            },
            {
                id: 'care1',
                name: 'Emma (Zorgverlener)',
                number: '0687654321',
                type: 'caregiver',
                photo: '~/images/contacts/emma.jpg'
            }
        ];

        // Laad recente activiteit
        this._recentActivity = [
            {
                icon: '~/images/icons/call.png',
                message: 'Gesprek met Jan (5 minuten geleden)',
                timestamp: new Date()
            },
            {
                icon: '~/images/icons/message.png',
                message: 'Bericht van Emma: "Ik kom morgen langs"',
                timestamp: new Date()
            }
        ];

        this.notifyPropertyChange('recentActivity', this._recentActivity);
    }

    async onFamilyTap() {
        // Toon familie contacten
        const familyContacts = this._contacts.filter(c => c.type === 'family');
        // Implementeer contact selectie en bel functionaliteit
    }

    async onCaregiverTap() {
        // Toon zorgverlener contacten
        const caregivers = this._contacts.filter(c => c.type === 'caregiver');
        // Implementeer contact selectie en bel functionaliteit
    }

    async sendQuickMessage(args: any) {
        const message = args.object.text;
        // Implementeer bericht verzenden functionaliteit
    }

    async onEmergency() {
        try {
            // Bel noodcontacten
            const emergencyContact = this._contacts.find(c => c.type === 'caregiver');
            if (emergencyContact) {
                await this.voipService.makeCall(emergencyContact.number);
            }
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Noodoproep Fout',
                message: 'Kan geen noodoproep maken',
                isCritical: true
            });
        }
    }

    showContacts() {
        // Navigeer naar contacten pagina
    }

    showMessages() {
        // Navigeer naar berichten pagina
    }

    showHelp() {
        // Toon help instructies
    }

    get recentActivity(): any[] {
        return this._recentActivity;
    }
}