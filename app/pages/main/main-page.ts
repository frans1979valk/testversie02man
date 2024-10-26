import { EventData, Page } from '@nativescript/core';
import { MainViewModel } from './main-view-model';
import { PermissionsService } from '../../services/permissions.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

export async function navigatingTo(args: EventData) {
    try {
        const page = <Page>args.object;
        
        // Controleer permissies voordat we de view model initialiseren
        const permissionsService = PermissionsService.getInstance();
        const hasPermissions = await permissionsService.hasAllPermissions();
        
        if (!hasPermissions) {
            const granted = await permissionsService.requestMissingPermissions();
            if (!granted) {
                throw new Error('Benodigde permissies niet toegekend');
            }
        }
        
        page.bindingContext = new MainViewModel();
    } catch (error) {
        ErrorHandlingService.getInstance().handleError(error, {
            title: 'Permissie Fout',
            message: 'De app heeft bepaalde permissies nodig om te functioneren.',
            isCritical: true
        });
    }
}