const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting MantelzorgConnect setup...');

// Controleer systeemvereisten
function checkRequirements() {
    console.log('\nControleren systeemvereisten...');
    
    // Check Node.js versie
    const nodeVersion = process.version;
    console.log(`Node.js versie: ${nodeVersion}`);
    if (parseInt(nodeVersion.slice(1)) < 14) {
        throw new Error('Node.js 14+ is vereist');
    }

    // Check schijfruimte
    const df = execSync('df -h /').toString();
    console.log('Schijfruimte beschikbaar:', df);
}

// Maak benodigde directories
function createDirectories() {
    console.log('\nMaken van directories...');
    
    const dirs = [
        'data',
        'data/sqlite',
        'data/uploads',
        'data/backups',
        'logs'
    ];

    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Directory gemaakt: ${dir}`);
        }
    });
}

// Configureer database
function setupDatabase() {
    console.log('\nConfigureren database...');
    
    const dbConfig = {
        type: 'sqlite',
        database: 'data/sqlite/mantelzorg.db'
    };

    fs.writeFileSync(
        path.join(__dirname, 'config/database.json'),
        JSON.stringify(dbConfig, null, 2)
    );
}

// Configureer VoIP
function setupVoIP() {
    console.log('\nConfigureren VoIP...');
    
    const voipConfig = {
        server: 'voip.cheapconnect.net',
        port: 5080,
        stunServer: 'stun.cheapconnect.net'
    };

    fs.writeFileSync(
        path.join(__dirname, 'config/voip.json'),
        JSON.stringify(voipConfig, null, 2)
    );
}

// Start setup
async function runSetup() {
    try {
        checkRequirements();
        createDirectories();
        setupDatabase();
        setupVoIP();
        
        console.log('\nSetup succesvol afgerond!');
        console.log('\nVolgende stappen:');
        console.log('1. Configureer je DNS records voor je domeinen');
        console.log('2. Start de applicatie met: npm run start:prod');
        console.log('3. Login op de admin interface en voltooi de configuratie');
        
    } catch (error) {
        console.error('\nFout tijdens setup:', error.message);
        process.exit(1);
    }
}

runSetup();