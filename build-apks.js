const { exec } = require('child_process');
const fs = require('fs');

const distributions = [
    {
        id: 'mantelzorg',
        name: 'Mantelzorg Connect',
        variants: ['phone', 'tablet']
    }
    // Voeg hier andere distributies toe
];

async function buildApks() {
    for (const dist of distributions) {
        for (const variant of dist.variants) {
            console.log(`Building ${dist.name} - ${variant}`);
            
            // Update config voor deze distributie
            updateDistributionConfig(dist.id, variant);
            
            // Build commando
            const buildCmd = `ns build android --release --key-store-path ./keystore/${dist.id}.keystore --key-store-password YOUR_PASSWORD --key-store-alias YOUR_ALIAS --key-store-alias-password YOUR_PASSWORD --aab --copy-to ./dist/${dist.id}/${variant}`;
            
            try {
                await executeCommand(buildCmd);
                console.log(`Successfully built ${dist.name} - ${variant}`);
            } catch (error) {
                console.error(`Error building ${dist.name} - ${variant}:`, error);
            }
        }
    }
}

function updateDistributionConfig(distId, variant) {
    // Update app.gradle voor tablet/phone specifieke instellingen
    const gradleConfig = `
        android {
            defaultConfig {
                applicationId "com.vipinstallatie.${distId}"
                versionCode 1
                versionName "1.0"
                
                ${variant === 'tablet' ? 'requiresSmallestWidthDp 600' : ''}
            }
        }
    `;
    
    fs.writeFileSync('App_Resources/Android/app.gradle', gradleConfig);
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

buildApks().catch(console.error);