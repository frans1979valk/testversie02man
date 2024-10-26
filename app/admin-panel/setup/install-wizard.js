// Installation Wizard Manager
class InstallationWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.config = {};
        this.initialize();
    }

    async initialize() {
        this.showStep(1);
        await this.checkRequirements();
        this.setupEventListeners();
    }

    async checkRequirements() {
        try {
            // Check Node.js versie
            const nodeVersion = process.version;
            document.getElementById('nodeVersion').textContent = nodeVersion;
            document.getElementById('nodeCheck').className = 
                'check-icon ' + (this.checkNodeVersion(nodeVersion) ? 'success' : 'error');

            // Check schijfruimte
            const space = await this.checkDiskSpace();
            document.getElementById('diskSpace').textContent = space + ' GB vrij';
            document.getElementById('diskCheck').className = 
                'check-icon ' + (space >= 1 ? 'success' : 'error');

            // Database check
            const dbOk = await this.checkDatabase();
            document.getElementById('dbCheck').className = 
                'check-icon ' + (dbOk ? 'success' : 'error');

            // Permissies check
            const permissionsOk = await this.checkPermissions();
            document.getElementById('permissionsCheck').className = 
                'check-icon ' + (permissionsOk ? 'success' : 'error');

        } catch (error) {
            console.error('Fout bij systeemcheck:', error);
            this.showError('Systeemcheck mislukt');
        }
    }

    checkNodeVersion(version) {
        const major = parseInt(version.slice(1).split('.')[0]);
        return major >= 14;
    }

    async checkDiskSpace() {
        // Implementeer schijfruimte check
        return 10; // Voorbeeld: 10 GB vrij
    }

    async checkDatabase() {
        // Database beschikbaarheid check
        return true;
    }

    async checkPermissions() {
        // Controleer schrijfrechten
        return true;
    }

    setupEventListeners() {
        document.getElementById('dbType')?.addEventListener('change', (e) => {
            const connectionFields = document.getElementById('dbConnectionFields');
            connectionFields.style.display = 
                e.target.value === 'sqlite' ? 'none' : 'block';
        });

        // Form validatie
        document.getElementById('adminConfigForm')?.addEventListener('input', () => {
            this.validateAdminForm();
        });
    }

    validateAdminForm() {
        const password = document.getElementById('adminPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        const email = document.getElementById('adminEmail').value;

        const isValid = password === confirm && 
                       password.length >= 8 &&
                       email.includes('@');

        document.getElementById('nextBtn').disabled = !isValid;
    }

    async nextStep() {
        if (await this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.saveStepData();
                this.showStep(this.currentStep + 1);
            } else {
                this.startInstallation();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(el => {
            el.style.display = 'none';
        });
        document.getElementById('step' + step).style.display = 'block';
        this.currentStep = step;

        // Update knoppen
        document.getElementById('prevBtn').style.display = 
            step === 1 ? 'none' : 'block';
        document.getElementById('nextBtn').textContent = 
            step === this.totalSteps ? 'Installeren' : 'Volgende';
    }

    async validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return await this.validateRequirements();
            case 2:
                return this.validateDatabaseConfig();
            case 3:
                return this.validateVoIPConfig();
            case 4:
                return this.validateAdminConfig();
            default:
                return true;
        }
    }

    async validateRequirements() {
        // Controleer of alle vereisten OK zijn
        const checks = document.querySelectorAll('.check-icon');
        return Array.from(checks).every(check => 
            check.classList.contains('success'));
    }

    validateDatabaseConfig() {
        const dbType = document.getElementById('dbType').value;
        if (dbType === 'sqlite') return true;

        // Valideer database verbinding
        const required = ['dbHost', 'dbPort', 'dbName', 'dbUser', 'dbPassword'];
        return required.every(field => 
            document.getElementById(field).value.trim() !== '');
    }

    validateVoIPConfig() {
        const required = ['sipServer', 'sipPort', 'sipUsername', 'callerId'];
        return required.every(field => 
            document.getElementById(field).value.trim() !== '');
    }

    validateAdminConfig() {
        const password = document.getElementById('adminPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        return password === confirm && password.length >= 8;
    }

    saveStepData() {
        switch (this.currentStep) {
            case 2:
                this.config.database = this.getDatabaseConfig();
                break;
            case 3:
                this.config.voip = this.getVoIPConfig();
                break;
            case 4:
                this.config.admin = this.getAdminConfig();
                break;
        }
    }

    getDatabaseConfig() {
        const dbType = document.getElementById('dbType').value;
        if (dbType === 'sqlite') {
            return {
                type: 'sqlite',
                filename: 'database.sqlite'
            };
        }

        return {
            type: dbType,
            host: document.getElementById('dbHost').value,
            port: document.getElementById('dbPort').value,
            database: document.getElementById('dbName').value,
            username: document.getElementById('dbUser').value,
            password: document.getElementById('dbPassword').value
        };
    }

    getVoIPConfig() {
        return {
            server: document.getElementById('sipServer').value,
            alternativeServer: document.getElementById('altServer').value,
            port: document.getElementById('sipPort').value,
            username: document.getElementById('sipUsername').value,
            callerId: document.getElementById('callerId').value
        };
    }

    getAdminConfig() {
        return {
            name: document.getElementById('adminName').value,
            email: document.getElementById('adminEmail').value,
            password: document.getElementById('adminPassword').value
        };
    }

    async startInstallation() {
        const progress = document.getElementById('progressBar');
        const status = document.getElementById('installationStatus');
        const log = document.getElementById('installationLog');

        const updateProgress = (percent, message) => {
            progress.style.width = percent + '%';
            status.textContent = message;
            log.innerHTML += `${message}<br>`;
            log.scrollTop = log.scrollHeight;
        };

        try {
            // Database setup
            updateProgress(20, 'Database configuratie...');
            await this.setupDatabase();

            // VoIP configuratie
            updateProgress(40, 'VoIP configuratie...');
            await this.setupVoIP();

            // Admin account
            updateProgress(60, 'Admin account aanmaken...');
            await this.setupAdmin();

            // Basis data
            updateProgress(80, 'Basis gegevens importeren...');
            await this.importBaseData();

            // Afronden
            updateProgress(100, 'Installatie voltooid!');
            
            setTimeout(() => {
                window.location.href = '/admin-panel/super-admin/';
            }, 2000);

        } catch (error) {
            console.error('Installatie fout:', error);
            updateProgress(0, 'Fout tijdens installatie: ' + error.message);
        }
    }

    async setupDatabase() {
        // Implementeer database setup
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async setupVoIP() {
        // Implementeer VoIP configuratie
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async setupAdmin() {
        // Implementeer admin account setup
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async importBaseData() {
        // Implementeer basis data import
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    showError(message) {
        alert('Fout: ' + message);
    }
}

// Initialize wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wizard = new InstallationWizard();
});