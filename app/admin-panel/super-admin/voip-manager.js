// VoIP Settings Manager
class VoIPManager {
    constructor() {
        this.distributions = [];
        this.currentDistribution = null;
        this.globalSettings = null;
        this.initialize();
    }

    async initialize() {
        await this.loadDistributions();
        await this.loadGlobalSettings();
        this.setupEventListeners();
        this.populateDistributionSelect();
    }

    async loadDistributions() {
        try {
            // In productie: Haal distributies op van de server
            const savedDistributions = localStorage.getItem('distributions');
            this.distributions = savedDistributions ? JSON.parse(savedDistributions) : [];
        } catch (error) {
            console.error('Fout bij laden distributies:', error);
            this.showError('Fout bij laden distributies');
        }
    }

    async loadGlobalSettings() {
        try {
            const savedSettings = localStorage.getItem('voip_global_settings');
            this.globalSettings = savedSettings ? JSON.parse(savedSettings) : {
                enabled: true,
                serverAddress: 'voip.cheapconnect.net',
                alternativeServerAddress: 'sip.cheapconnect.net',
                defaultPort: 5080,
                codec: {
                    preferences: ['G.711A', 'G.729A/B']
                },
                dtmf: 'RFC2833',
                stunEnabled: false,
                sipAlgBypass: true,
                registrationTimeout: 3600
            };

            this.populateGlobalSettings();
        } catch (error) {
            console.error('Fout bij laden globale instellingen:', error);
            this.showError('Fout bij laden globale instellingen');
        }
    }

    populateGlobalSettings() {
        document.getElementById('globalVoipEnabled').checked = this.globalSettings.enabled;
        document.getElementById('primaryServer').value = this.globalSettings.serverAddress;
        document.getElementById('alternativeServer').value = this.globalSettings.alternativeServerAddress;
        document.getElementById('defaultPort').value = this.globalSettings.defaultPort;
        document.getElementById('dtmfMode').value = this.globalSettings.dtmf;
        document.getElementById('stunEnabled').checked = this.globalSettings.stunEnabled;
        document.getElementById('sipAlgBypass').checked = this.globalSettings.sipAlgBypass;
        document.getElementById('registrationTimeout').value = this.globalSettings.registrationTimeout;
    }

    populateDistributionSelect() {
        const select = document.getElementById('distributionSelect');
        select.innerHTML = this.distributions.map(dist => 
            `<option value="${dist.id}">${dist.name}</option>`
        ).join('');

        if (select.options.length > 0) {
            this.loadDistributionSettings(select.options[0].value);
        }
    }

    async loadDistributionSettings(distributionId) {
        try {
            const distribution = this.distributions.find(d => d.id === distributionId);
            if (!distribution) return;

            this.currentDistribution = distribution;
            
            document.getElementById('distributionVoipEnabled').checked = 
                distribution.voipSettings?.enabled ?? true;
            document.getElementById('sipPrefix').value = 
                distribution.voipSettings?.sipPrefix ?? '31453';
            document.getElementById('callerIdPrefix').value = 
                distribution.voipSettings?.callerIdPrefix ?? '+31453';
            document.getElementById('maxCalls').value = 
                distribution.voipSettings?.maxCalls ?? 10;
        } catch (error) {
            console.error('Fout bij laden distributie instellingen:', error);
            this.showError('Fout bij laden distributie instellingen');
        }
    }

    async saveGlobalSettings() {
        try {
            const settings = {
                enabled: document.getElementById('globalVoipEnabled').checked,
                serverAddress: document.getElementById('primaryServer').value,
                alternativeServerAddress: document.getElementById('alternativeServer').value,
                defaultPort: parseInt(document.getElementById('defaultPort').value),
                dtmf: document.getElementById('dtmfMode').value,
                stunEnabled: document.getElementById('stunEnabled').checked,
                sipAlgBypass: document.getElementById('sipAlgBypass').checked,
                registrationTimeout: parseInt(document.getElementById('registrationTimeout').value),
                codec: {
                    preferences: this.getCodecPreferences()
                }
            };

            // Valideer instellingen
            if (!this.validateSettings(settings)) {
                return;
            }

            localStorage.setItem('voip_global_settings', JSON.stringify(settings));
            this.globalSettings = settings;
            
            // Sla ook distributie-specifieke instellingen op
            if (this.currentDistribution) {
                await this.saveDistributionSettings();
            }

            this.showSuccess('Instellingen succesvol opgeslagen');
        } catch (error) {
            console.error('Fout bij opslaan instellingen:', error);
            this.showError('Fout bij opslaan instellingen');
        }
    }

    async saveDistributionSettings() {
        if (!this.currentDistribution) return;

        const settings = {
            enabled: document.getElementById('distributionVoipEnabled').checked,
            sipPrefix: document.getElementById('sipPrefix').value,
            callerIdPrefix: document.getElementById('callerIdPrefix').value,
            maxCalls: parseInt(document.getElementById('maxCalls').value)
        };

        this.currentDistribution.voipSettings = settings;
        
        // Update distribution in storage
        const index = this.distributions.findIndex(d => d.id === this.currentDistribution.id);
        if (index !== -1) {
            this.distributions[index] = this.currentDistribution;
            localStorage.setItem('distributions', JSON.stringify(this.distributions));
        }
    }

    getCodecPreferences() {
        const codecList = document.getElementById('codecList');
        const codecItems = codecList.getElementsByClassName('codec-item');
        const preferences = [];

        for (const item of codecItems) {
            const codec = item.getElementsByTagName('span')[0].textContent;
            const priority = parseInt(item.getElementsByTagName('input')[0].value);
            preferences.push({ codec, priority });
        }

        return preferences.sort((a, b) => a.priority - b.priority).map(p => p.codec);
    }

    validateSettings(settings) {
        if (!settings.serverAddress) {
            this.showError('Primaire SIP server is verplicht');
            return false;
        }

        if (settings.registrationTimeout < 300 || settings.registrationTimeout > 7200) {
            this.showError('Registratie timeout moet tussen 300 en 7200 seconden zijn');
            return false;
        }

        return true;
    }

    async testCall() {
        const testNumber = document.getElementById('testNumber').value;
        if (!testNumber) {
            this.showError('Voer een telefoonnummer in voor de test');
            return;
        }

        const resultDiv = document.getElementById('testResult');
        resultDiv.className = 'test-result';
        resultDiv.textContent = 'Test oproep wordt opgezet...';

        try {
            // Simuleer een test oproep
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            resultDiv.className = 'test-result success';
            resultDiv.textContent = 'Test oproep succesvol opgezet naar ' + testNumber;
        } catch (error) {
            resultDiv.className = 'test-result error';
            resultDiv.textContent = 'Fout bij test oproep: ' + error.message;
        }
    }

    setupEventListeners() {
        document.getElementById('distributionSelect')?.addEventListener('change', (e) => {
            this.loadDistributionSettings(e.target.value);
        });
    }

    showSuccess(message) {
        alert(message); // In productie: Vervang door mooiere notificatie
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Vervang door mooiere notificatie
    }
}

// Initialize VoIP manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voipManager = new VoIPManager();
});