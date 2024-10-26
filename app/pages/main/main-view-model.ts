import { Observable, Utils } from '@nativescript/core';
import { VoIPService } from '../../services/voip.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

export class MainViewModel extends Observable {
    private voipService: VoIPService;
    private _isCallInProgress: boolean = false;

    constructor() {
        super();
        this.voipService = VoIPService.getInstance();
    }

    async makeCall(number: string) {
        if (this._isCallInProgress) {
            console.log('Er is al een gesprek actief');
            return;
        }

        try {
            this._isCallInProgress = true;
            this.notifyPropertyChange('isCallInProgress', true);

            // Probeer eerst via VoIP
            const success = await this.voipService.makeCall(number);
            
            if (!success) {
                // Fallback naar normale telefoon
                Utils.openUrl(`tel:${number}`);
            }
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Belfout',
                message: 'Kan geen gesprek opzetten',
                isCritical: false
            });
        } finally {
            this._isCallInProgress = false;
            this.notifyPropertyChange('isCallInProgress', false);
        }
    }
}