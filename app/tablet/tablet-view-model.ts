import { Observable } from '@nativescript/core';
import { VoIPService } from '../services/voip.service';
import { ErrorHandlingService } from '../services/error-handling.service';
import { DistributionService } from '../services/distribution.service';

export class TabletViewModel extends Observable {
    private voipService: VoIPService;
    private distributionService: DistributionService;
    private clockTimer: number;
    private _appName: string = 'VIP Installatie';
    private _currentTime: string = '';
    private _currentDate: string = '';
    private _todayAppointments: any[] = [];

    constructor() {
        super();
        this.voipService = VoIPService.getInstance();
        this.distributionService = DistributionService.getInstance();
        this.initializeViewModel();
        this.startClock();
        this.loadDistributionSettings();
        this.loadTodayAppointments();
    }

    private async loadDistributionSettings() {
        try {
            const settings = await this.distributionService.getCurrentDistributionSettings();
            if (settings?.appName) {
                this._appName = settings.appName;
                this.notifyPropertyChange('appName', this._appName);
            }
        } catch (error) {
            console.error('Fout bij laden distributie instellingen:', error);
        }
    }

    private startClock() {
        // Update klok elke seconde
        this.updateClock();
        this.clockTimer = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    private updateClock() {
        const now = new Date();
        this._currentTime = now.toLocaleTimeString('nl-NL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        this._currentDate = now.toLocaleDateString('nl-NL', { 
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        
        this.notifyPropertyChange('currentTime', this._currentTime);
        this.notifyPropertyChange('currentDate', this._currentDate);
    }

    private async loadTodayAppointments() {
        try {
            // In productie: Haal afspraken op van de server
            this._todayAppointments = [
                {
                    time: '09:00',
                    title: 'Fiber Installatie',
                    description: 'Hoofdstraat 1, Amsterdam'
                },
                {
                    time: '11:30',
                    title: 'Internet Storing',
                    description: 'Kerkweg 15, Rotterdam'
                },
                {
                    time: '14:00',
                    title: 'TV Installatie',
                    description: 'Dorpsstraat 8, Utrecht'
                }
            ];
            this.notifyPropertyChange('todayAppointments', this._todayAppointments);
        } catch (error) {
            console.error('Fout bij laden afspraken:', error);
        }
    }

    // Getters
    get appName(): string {
        return this._appName;
    }

    get currentTime(): string {
        return this._currentTime;
    }

    get currentDate(): string {
        return this._currentDate;
    }

    get todayAppointments(): any[] {
        return this._todayAppointments;
    }

    // Cleanup
    onDestroy() {
        if (this.clockTimer) {
            clearInterval(this.clockTimer);
        }
        super.onDestroy();
    }

    // Rest van de bestaande code blijft hetzelfde...
}