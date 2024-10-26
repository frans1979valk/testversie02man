import { Observable } from '@nativescript/core';
import { AppModeService, AppModeSettings } from '../../services/app-mode.service';

export class AppModeSettingsViewModel extends Observable {
    private appModeService: AppModeService;
    private _settings: AppModeSettings;

    constructor() {
        super();
        this.appModeService = AppModeService.getInstance();
        this._settings = this.appModeService.settings;
    }

    get settings(): AppModeSettings {
        return this._settings;
    }

    async toggleAutoStart() {
        try {
            await this.appModeService.updateSettings({
                autoStart: !this._settings.autoStart
            });
            this._settings = this.appModeService.settings;
            this.notifyPropertyChange('settings', this._settings);
        } catch (error) {
            console.error('Fout bij wijzigen auto-start:', error);
        }
    }

    async toggleKioskMode() {
        try {
            await this.appModeService.updateSettings({
                kioskMode: !this._settings.kioskMode
            });
            this._settings = this.appModeService.settings;
            this.notifyPropertyChange('settings', this._settings);
        } catch (error) {
            console.error('Fout bij wijzigen kiosk mode:', error);
        }
    }

    async updateExitCode(code: string) {
        if (code.length === 4 && /^\d+$/.test(code)) {
            await this.appModeService.updateSettings({
                exitCode: code
            });
            this._settings = this.appModeService.settings;
            this.notifyPropertyChange('settings', this._settings);
        }
    }
}