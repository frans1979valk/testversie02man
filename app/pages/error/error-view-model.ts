import { Observable } from '@nativescript/core';
import { NavigationService } from '../../services/navigation.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

export class ErrorViewModel extends Observable {
    private _showTechnicalDetails: boolean = false;
    private _errorData: any;

    constructor(errorData: any) {
        super();
        this._errorData = errorData;
        this.initializeErrorData();
    }

    get errorTitle(): string {
        return this._errorData.title || 'Er is een fout opgetreden';
    }

    get errorMessage(): string {
        return this._errorData.message || 'Er is iets misgegaan in de applicatie.';
    }

    get errorCode(): string {
        return this._errorData.code || 'ERR_UNKNOWN';
    }

    get errorTime(): string {
        return new Date().toLocaleString();
    }

    get errorType(): string {
        return this._errorData.type || 'Algemene Fout';
    }

    get technicalDetails(): string {
        return this._errorData.technicalDetails || 'Geen technische details beschikbaar';
    }

    get stackTrace(): string {
        return this._errorData.stack || '';
    }

    get showTechnicalDetails(): boolean {
        return this._showTechnicalDetails;
    }

    get isCriticalError(): boolean {
        return this._errorData.isCritical || false;
    }

    toggleTechnicalDetails() {
        this._showTechnicalDetails = !this._showTechnicalDetails;
        this.notifyPropertyChange('showTechnicalDetails', this._showTechnicalDetails);
    }

    async retryAction() {
        if (this._errorData.retryAction) {
            try {
                await this._errorData.retryAction();
            } catch (error) {
                ErrorHandlingService.getInstance().handleError(error);
            }
        }
    }

    goToDashboard() {
        NavigationService.getInstance().navigateToDashboard();
    }

    contactSupport() {
        const supportEmail = 'support@vip-installatie.nl';
        const subject = `Foutmelding: ${this.errorCode}`;
        const body = `
Foutcode: ${this.errorCode}
Tijdstip: ${this.errorTime}
Type: ${this.errorType}
Bericht: ${this.errorMessage}

Technische Details:
${this.technicalDetails}

${this.stackTrace}
        `.trim();

        const emailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        Utils.openUrl(emailUrl);
    }

    private initializeErrorData() {
        // Log error voor analyse
        console.error('App Error:', {
            code: this.errorCode,
            type: this.errorType,
            message: this.errorMessage,
            technical: this.technicalDetails,
            stack: this.stackTrace,
            timestamp: this.errorTime
        });
    }
}