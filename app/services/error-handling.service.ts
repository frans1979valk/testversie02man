import { Observable } from '@nativescript/core';
import { NavigationService } from './navigation.service';

export class ErrorHandlingService extends Observable {
    private static instance: ErrorHandlingService;
    private navigationService: NavigationService;
    private readonly ERROR_TYPES = {
        NETWORK: 'network',
        VOIP: 'voip',
        PERMISSION: 'permission',
        AUDIO: 'audio',
        DATABASE: 'database',
        UNKNOWN: 'unknown'
    };

    private constructor() {
        super();
        this.navigationService = NavigationService.getInstance();
        this.setupGlobalErrorHandling();
    }

    private setupGlobalErrorHandling() {
        global.errorHandler = (error: Error) => {
            this.handleError(error);
            return true;
        };

        global.unhandledRejectionHandler = (error: any) => {
            this.handleError(error);
            return true;
        };
    }

    handleError(error: any, customData: Partial<ErrorData> = {}) {
        const errorData = this.parseError(error, customData);
        
        // Log error
        console.error('Application Error:', errorData);

        // Toon gebruiksvriendelijke foutmelding
        if (errorData.isCritical) {
            this.navigationService.navigateToError(errorData);
        } else {
            // Toon niet-kritieke fout als melding
            this.showErrorDialog(errorData);
        }

        // Stuur error naar logging service
        this.logErrorToService(errorData);
    }

    private showErrorDialog(errorData: ErrorData) {
        // Implementeer gebruiksvriendelijke foutmelding
        alert({
            title: errorData.title || 'Fout',
            message: errorData.message,
            okButtonText: 'OK'
        });
    }

    // Rest van de code blijft hetzelfde...
}