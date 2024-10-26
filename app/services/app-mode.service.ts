import { Observable, ApplicationSettings } from '@nativescript/core';
import { android as androidApp } from '@nativescript/core/application';

export interface AppModeSettings {
    autoStart: boolean;
    kioskMode: boolean;
    exitCode: string;
    allowedApps?: string[];
}

export class AppModeService extends Observable {
    private static instance: AppModeService;
    private _settings: AppModeSettings;
    private readonly SETTINGS_KEY = 'app_mode_settings';

    private constructor() {
        super();
        this._settings = this.loadSettings();
        this.initializeAppMode();
    }

    static getInstance(): AppModeService {
        if (!AppModeService.instance) {
            AppModeService.instance = new AppModeService();
        }
        return AppModeService.instance;
    }

    private loadSettings(): AppModeSettings {
        const defaultSettings: AppModeSettings = {
            autoStart: false,
            kioskMode: false,
            exitCode: '1234',
            allowedApps: []
        };

        const savedSettings = ApplicationSettings.getString(this.SETTINGS_KEY);
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    async updateSettings(settings: Partial<AppModeSettings>): Promise<void> {
        this._settings = { ...this._settings, ...settings };
        ApplicationSettings.setString(this.SETTINGS_KEY, JSON.stringify(this._settings));
        await this.applySettings();
    }

    private async initializeAppMode(): Promise<void> {
        if (androidApp) {
            if (this._settings.autoStart) {
                await this.setupAutoStart();
            }
            if (this._settings.kioskMode) {
                await this.enableKioskMode();
            }
        }
    }

    private async setupAutoStart(): Promise<void> {
        if (androidApp) {
            try {
                const context = androidApp.context;
                const receiver = new android.content.ComponentName(context, "com.vipinstallatie.BootReceiver");
                const pm = context.getPackageManager();
                
                pm.setComponentEnabledSetting(
                    receiver,
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                    android.content.pm.PackageManager.DONT_KILL_APP
                );
            } catch (error) {
                console.error('Fout bij instellen auto-start:', error);
            }
        }
    }

    private async enableKioskMode(): Promise<void> {
        if (androidApp) {
            try {
                const activity = androidApp.foregroundActivity;
                if (activity) {
                    // Voorkom recente apps lijst
                    activity.setTaskDescription(new android.app.ActivityManager.TaskDescription(null, null, 0));
                    
                    // Vergrendel naar volledig scherm
                    const flags = android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN |
                                android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                                android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                                android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED;
                    
                    activity.getWindow().addFlags(flags);
                }
            } catch (error) {
                console.error('Fout bij inschakelen kiosk mode:', error);
            }
        }
    }

    async disableKioskMode(): Promise<void> {
        if (androidApp) {
            try {
                const activity = androidApp.foregroundActivity;
                if (activity) {
                    const flags = android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN |
                                android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                                android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                                android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED;
                    
                    activity.getWindow().clearFlags(flags);
                }
            } catch (error) {
                console.error('Fout bij uitschakelen kiosk mode:', error);
            }
        }
    }

    verifyExitCode(code: string): boolean {
        return code === this._settings.exitCode;
    }

    get settings(): AppModeSettings {
        return { ...this._settings };
    }
}