import { Application } from '@nativescript/core';
import { PermissionsService } from './services/permissions.service';
import { NetworkService } from './services/network.service';
import { ErrorHandlingService } from './services/error-handling.service';

Application.on(Application.launchEvent, () => {
    try {
        // Initialize services
        PermissionsService.getInstance();
        NetworkService.getInstance();
        ErrorHandlingService.getInstance();
    } catch (error) {
        console.error('Error during app initialization:', error);
        ErrorHandlingService.getInstance().handleError(error, {
            title: 'Initialisatie Fout',
            message: 'Er is een fout opgetreden tijdens het opstarten van de app.',
            isCritical: true
        });
    }
});

Application.run({ moduleName: 'pages/main/main-page' });