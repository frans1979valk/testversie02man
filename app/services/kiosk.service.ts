import { Observable } from '@nativescript/core';
import { android as androidApp } from '@nativescript/core/application';

export class KioskService extends Observable {
    private static instance: KioskService;
    private _isKioskMode: boolean = false;
    private _exitCode: string = '';
    private _allowedApps: string[] = [];

    private constructor() {
        super();
        this.initialize();
    }

    static getInstance(): KioskService {
        if (!KioskService.instance) {
            KioskService.instance = new KioskService();
        }
        return KioskService.instance;
    }

    private async initialize() {
        if (androidApp) {
            this._allowedApps = [
                'com.vipinstallatie.app',
                'com.android.systemui'
            ];
            await this.setupKioskPolicies();
        }
    }

    private async setupKioskPolicies() {
        if (androidApp) {
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

                // Voorkom statusbalk pull-down
                activity.getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
            }
        }
    }

    async enableKioskMode(exitCode: string): Promise<boolean> {
        try {
            this._exitCode = exitCode;
            this._isKioskMode = true;

            if (androidApp) {
                const activity = androidApp.foregroundActivity;
                if (activity) {
                    // Start app lock service
                    const serviceIntent = new android.content.Intent(activity, com.vipinstallatie.KioskService.class);
                    activity.startService(serviceIntent);

                    // Vergrendel taak
                    const deviceAdmin = activity.getSystemService(android.content.Context.DEVICE_POLICY_SERVICE);
                    if (deviceAdmin) {
                        deviceAdmin.setLockTaskPackages(activity.getPackageName());
                        activity.startLockTask();
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('Fout bij inschakelen kiosk mode:', error);
            return false;
        }
    }

    async disableKioskMode(exitCode: string): Promise<boolean> {
        if (exitCode !== this._exitCode) {
            return false;
        }

        try {
            this._isKioskMode = false;
            this._exitCode = '';

            if (androidApp) {
                const activity = androidApp.foregroundActivity;
                if (activity) {
                    // Stop app lock service
                    const serviceIntent = new android.content.Intent(activity, com.vipinstallatie.KioskService.class);
                    activity.stopService(serviceIntent);

                    // Ontgrendel taak
                    activity.stopLockTask();
                }
            }

            return true;
        } catch (error) {
            console.error('Fout bij uitschakelen kiosk mode:', error);
            return false;
        }
    }

    isAppAllowed(packageName: string): boolean {
        return this._allowedApps.includes(packageName);
    }

    get isKioskMode(): boolean {
        return this._isKioskMode;
    }
}