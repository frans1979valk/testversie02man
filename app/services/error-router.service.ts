import { Observable } from '@nativescript/core';
import { NavigationService } from './navigation.service';

export interface ErrorRoute {
    code: string;
    page: string;
    params?: any;
}

export class ErrorRouterService extends Observable {
    private static instance: ErrorRouterService;
    private navigationService: NavigationService;
    private readonly errorRoutes: ErrorRoute[] = [
        { code: 'NETWORK_ERROR', page: 'pages/error/network-error-page' },
        { code: 'AUTH_ERROR', page: 'pages/error/auth-error-page' },
        { code: 'CAMERA_ERROR', page: 'pages/error/camera-error-page' },
        { code: 'VOIP_ERROR', page: 'pages/error/voip-error-page' },
        { code: 'PERMISSION_ERROR', page: 'pages/error/permission-error-page' }
    ];

    private constructor() {
        super();
        this.navigationService = NavigationService.getInstance();
    }

    static getInstance(): ErrorRouterService {
        if (!ErrorRouterService.instance) {
            ErrorRouterService.instance = new ErrorRouterService();
        }
        return ErrorRouterService.instance;
    }

    routeError(error: any): void {
        const errorCode = this.getErrorCode(error);
        const route = this.errorRoutes.find(r => r.code === errorCode);

        if (route) {
            this.navigationService.navigate(route.page, {
                ...route.params,
                error: error
            });
        } else {
            // Fallback naar generieke error pagina
            this.navigationService.navigate('pages/error/error-page', {
                error: error
            });
        }
    }

    private getErrorCode(error: any): string {
        if (error.code) return error.code;
        if (error.message?.includes('network')) return 'NETWORK_ERROR';
        if (error.message?.includes('permission')) return 'PERMISSION_ERROR';
        if (error.message?.includes('camera')) return 'CAMERA_ERROR';
        if (error.message?.includes('voip')) return 'VOIP_ERROR';
        if (error.message?.includes('auth')) return 'AUTH_ERROR';
        return 'UNKNOWN_ERROR';
    }
}