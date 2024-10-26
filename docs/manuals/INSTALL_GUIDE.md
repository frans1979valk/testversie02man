# Installatie Handleiding MantelzorgConnect

## Server Vereisten
- Node.js 14+
- 1GB vrije schijfruimte
- SQLite of PostgreSQL database
- SSL certificaat voor productie

## DNS Configuratie
1. Hoofddomeinen instellen:
   ```
   mantelzorgconnect.nl
   mantelzorgconnect.online
   test1.mantelzorgconnect.nl
   ```

2. DNS Records:
   - A Records voor alle domeinen
   - MX Records (optioneel voor mail)
   - SPF/DKIM (indien mail gebruikt wordt)

## Installatie Stappen

### 1. Basis Setup
```bash
# Clone repository
git clone https://github.com/mantelzorgconnect/app.git
cd app

# Installeer dependencies
npm install
```

### 2. Database Setup
```bash
# SQLite (aanbevolen voor <5 distributies)
npm run setup:sqlite

# Of PostgreSQL
npm run setup:postgres
```

### 3. SSL Certificaten
1. Installeer certificaten voor:
   - mantelzorgconnect.nl
   - mantelzorgconnect.online
   - test1.mantelzorgconnect.nl

### 4. App Configuratie
1. Configureer `config/app.json`:
   ```json
   {
     "domain": "mantelzorgconnect.nl",
     "alternateDomain": "mantelzorgconnect.online",
     "testDomain": "test1.mantelzorgconnect.nl"
   }
   ```

### 5. VoIP Setup
1. Configureer SIP server
2. Test audio kwaliteit
3. Verifieer failover werking

### 6. Builds Genereren

#### Android Phone App
```bash
ns build android --release --key-store-path ./keystore/phone.keystore
```

#### Android Tablet App
```bash
ns build android --release --key-store-path ./keystore/tablet.keystore
```

### 7. Eerste Start
1. Start installatie wizard:
   ```bash
   npm run setup
   ```

2. Volg de wizard stappen:
   - Database configuratie
   - Admin account aanmaken
   - Distributie instellingen
   - Mail server (optioneel)

3. Start de applicatie:
   ```bash
   npm run start:prod
   ```

## Beheerders Setup

### Super Admin
1. Login als super admin
2. Configureer:
   - Globale VoIP instellingen
   - Distributie templates
   - Gebruikersgroepen
   - Factuurinstellingen

### Distributie Beheerder
1. Maak distributie aan
2. Configureer:
   - Branding
   - Gebruikerslimieten
   - Camera instellingen (optioneel)
   - Noodknop configuratie

## Updates & Onderhoud

### Automatische Updates
1. Play Store updates
2. Server updates via CI/CD
3. Database migraties

### Backup Procedure
1. Database backup
2. Configuratie files
3. Gebruikersdata
4. SSL certificaten

## Support
- Email: support@mantelzorgconnect.nl
- Telefoon: [Support nummer]
- Bereikbaarheid: Ma-Vr, 9:00-17:00