import { Observable } from '@nativescript/core';

export interface DomainConfig {
    main: string;
    alternate: string;
    subdomains: {
        [key: string]: string;
    };
}

export interface DistributionSettings {
    id: string;
    name: string;
    appName: string;
    domains: DomainConfig;
    color: string;
    logo: string;
    features: {
        contactPhotos: boolean;
        voipEnabled: boolean;
        emergencyEnabled: boolean;
    };
}

export const MANTELZORG_DOMAINS: DomainConfig = {
    main: 'mantelzorgconnect.nl',
    alternate: 'mantelzorgconnect.online',
    subdomains: {
        test1: 'test1.mantelzorgconnect.nl',
        test2: 'test2.mantelzorgconnect.online'
    }
};

export class DistributionService extends Observable {
    private static instance: DistributionService;
    private _currentDistribution: DistributionSettings | null = null;

    private constructor() {
        super();
        this.loadCurrentDistribution();
    }

    static getInstance(): DistributionService {
        if (!DistributionService.instance) {
            DistributionService.instance = new DistributionService();
        }
        return DistributionService.instance;
    }

    getDomainForEnvironment(environment: string = 'production'): string {
        switch (environment) {
            case 'test1':
                return MANTELZORG_DOMAINS.subdomains.test1;
            case 'test2':
                return MANTELZORG_DOMAINS.subdomains.test2;
            case 'alternate':
                return MANTELZORG_DOMAINS.alternate;
            default:
                return MANTELZORG_DOMAINS.main;
        }
    }

    async updateDistributionDomain(domain: string): Promise<void> {
        if (!this._currentDistribution) return;

        this._currentDistribution.domains = {
            ...MANTELZORG_DOMAINS,
            main: domain
        };

        await this.saveDistributionSettings();
    }

    private async loadCurrentDistribution() {
        try {
            const distributionId = localStorage.getItem('currentDistributionId');
            if (distributionId) {
                this._currentDistribution = await this.getDistributionById(distributionId);
            }
        } catch (error) {
            console.error('Fout bij laden distributie:', error);
        }
    }

    private async getDistributionById(id: string): Promise<DistributionSettings | null> {
        const distributions = JSON.parse(localStorage.getItem('distributions') || '[]');
        return distributions.find((d: DistributionSettings) => d.id === id) || null;
    }

    private async saveDistributionSettings(): Promise<void> {
        if (!this._currentDistribution) return;

        const distributions = JSON.parse(localStorage.getItem('distributions') || '[]');
        const index = distributions.findIndex((d: DistributionSettings) => 
            d.id === this._currentDistribution?.id);
        
        if (index !== -1) {
            distributions[index] = this._currentDistribution;
            localStorage.setItem('distributions', JSON.stringify(distributions));
        }
    }
}