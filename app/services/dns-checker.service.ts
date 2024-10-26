import { Observable } from '@nativescript/core';
import { ErrorHandlingService } from './error-handling.service';

export interface DNSConfig {
    mainDomain: string;
    alternateDomain: string;
    subdomains: string[];
    ipAddress: string;
    mailEnabled: boolean;
    mailServer?: string;
}

export class DNSCheckerService extends Observable {
    private static instance: DNSCheckerService;
    private _config: DNSConfig = {
        mainDomain: 'mantelzorgconnect.nl',
        alternateDomain: 'mantelzorgconnect.online',
        subdomains: ['test1'],
        ipAddress: '',
        mailEnabled: false,
        mailServer: ''
    };

    private constructor() {
        super();
        this.initialize();
    }

    static getInstance(): DNSCheckerService {
        if (!DNSCheckerService.instance) {
            DNSCheckerService.instance = new DNSCheckerService();
        }
        return DNSCheckerService.instance;
    }

    private async initialize() {
        try {
            await this.detectIPAddress();
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error);
        }
    }

    async detectIPAddress(): Promise<string> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this._config.ipAddress = data.ip;
            return data.ip;
        } catch (error) {
            console.error('IP detectie fout:', error);
            throw error;
        }
    }

    setMailConfig(enabled: boolean, server?: string) {
        this._config.mailEnabled = enabled;
        this._config.mailServer = server;
    }

    getDNSInstructions(): string {
        let instructions = `
TransIP DNS Instellingen:

1. Hoofddomein (${this._config.mainDomain}):
   Type: A
   Naam: @
   Inhoud: ${this._config.ipAddress}
   TTL: 3600

2. www subdomain:
   Type: A
   Naam: www
   Inhoud: ${this._config.ipAddress}
   TTL: 3600

3. Test subdomain:
   Type: A
   Naam: test1
   Inhoud: ${this._config.ipAddress}
   TTL: 3600

4. Alternatief domein (${this._config.alternateDomain}):
   Type: A
   Naam: @
   Inhoud: ${this._config.ipAddress}
   TTL: 3600

5. www voor alternatief:
   Type: A
   Naam: www
   Inhoud: ${this._config.ipAddress}
   TTL: 3600`;

        if (this._config.mailEnabled && this._config.mailServer) {
            instructions += `

Mail Server Instellingen:

6. MX Record voor ${this._config.mainDomain}:
   Type: MX
   Naam: @
   Inhoud: ${this._config.mailServer}
   Prioriteit: 10
   TTL: 3600

7. MX Record voor ${this._config.alternateDomain}:
   Type: MX
   Naam: @
   Inhoud: ${this._config.mailServer}
   Prioriteit: 10
   TTL: 3600

8. SPF Records:
   Type: TXT
   Naam: @
   Inhoud: "v=spf1 mx ~all"
   TTL: 3600`;
        }

        return instructions;
    }

    async verifyDNSSetup(): Promise<{success: boolean; details: string[]}> {
        try {
            const checks: {domain: string; type: string; success: boolean}[] = [];
            
            // Check A records
            const domains = [
                this._config.mainDomain,
                `www.${this._config.mainDomain}`,
                `test1.${this._config.mainDomain}`,
                this._config.alternateDomain,
                `www.${this._config.alternateDomain}`
            ];

            for (const domain of domains) {
                const success = await this.checkDomain(domain);
                checks.push({ domain, type: 'A', success });
            }

            // Check MX records if mail is enabled
            if (this._config.mailEnabled && this._config.mailServer) {
                const mxDomains = [this._config.mainDomain, this._config.alternateDomain];
                for (const domain of mxDomains) {
                    const hasMX = await this.checkMXRecord(domain);
                    checks.push({ domain, type: 'MX', success: hasMX });
                }
            }

            const details = checks.map(check => 
                `${check.success ? '✓' : '✗'} ${check.domain} (${check.type})`
            );

            return {
                success: checks.every(check => check.success),
                details
            };
        } catch (error) {
            console.error('DNS verificatie fout:', error);
            return {
                success: false,
                details: ['Fout bij DNS verificatie']
            };
        }
    }

    private async checkDomain(domain: string): Promise<boolean> {
        try {
            const response = await fetch(`https://${domain}`);
            return response.ok;
        } catch {
            return false;
        }
    }

    private async checkMXRecord(domain: string): Promise<boolean> {
        try {
            // Simuleer MX record check (in productie: gebruik DNS lookup)
            return true;
        } catch {
            return false;
        }
    }

    get config(): DNSConfig {
        return this._config;
    }
}