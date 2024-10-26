import { Application, AndroidApplication } from '@nativescript/core';
import * as permissions from '@nativescript/core/permissions';
import { ErrorHandlingService } from './error-handling.service';

export class PermissionsService {
    private static instance: PermissionsService;
    private _requiredPermissions: string[] = [];
    private _grantedPermissions: Set<string> = new Set();

    private constructor() {
        this.initializePermissions();
    }

    private async initializePermissions() {
        if (global.isAndroid) {
            this._requiredPermissions = [
                android.Manifest.permission.RECORD_AUDIO,
                android.Manifest.permission.MODIFY_AUDIO_SETTINGS,
                android.Manifest.permission.BLUETOOTH,
                android.Manifest.permission.BLUETOOTH_ADMIN,
                android.Manifest.permission.BLUETOOTH_CONNECT,
                android.Manifest.permission.BLUETOOTH_SCAN,
                android.Manifest.permission.CALL_PHONE,
                android.Manifest.permission.READ_PHONE_STATE
            ];

            try {
                await this.requestAllPermissions();
            } catch (error) {
                ErrorHandlingService.getInstance().handleError(error, {
                    title: 'Permissie Fout',
                    message: 'Kan benodigde permissies niet verkrijgen',
                    isCritical: true
                });
            }
        }
    }

    private async requestAllPermissions(): Promise<void> {
        for (const permission of this._requiredPermissions) {
            try {
                const granted = await permissions.requestPermission(permission);
                if (granted) {
                    this._grantedPermissions.add(permission);
                }
            } catch (error) {
                console.error(`Fout bij aanvragen permissie ${permission}:`, error);
                throw error;
            }
        }
    }

    // Rest van de code blijft hetzelfde...
}