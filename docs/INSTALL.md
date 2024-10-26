# Installatie Handleiding

## Server Installatie

### Voorbereiding
1. Controleer systeemvereisten
   ```bash
   node -v  # Moet 14+ zijn
   df -h    # Minimaal 1GB vrij
   ```

2. Clone repository
   ```bash
   git clone https://github.com/mantelzorgconnect/app.git
   cd app
   ```

3. Installeer dependencies
   ```bash
   npm install
   ```

### DNS Configuratie
1. Configureer DNS records voor:
   - mantelzorgconnect.nl
   - mantelzorgconnect.online
   - test1.mantelzorgconnect.nl

2. Voeg MX records toe indien mailserver gebruikt wordt

### Database Setup
1. Kies database type:
   - SQLite (aanbevolen voor <5 distributies)
   - PostgreSQL (voor grotere installaties)

2. Voer migraties uit:
   ```bash
   npm run migrate
   ```

### VoIP Configuratie
1. Configureer SIP server in `config/voip.json`
2. Test verbinding:
   ```bash
   npm run test:voip
   ```

### SSL Setup
1. Installeer certificaten voor alle domeinen
2. Configureer NGINX/Apache
3. Test SSL configuratie

### App Builds
1. Android Phone Build:
   ```bash
   ns build android --release --key-store-path ./keystore/phone.keystore
   ```

2. Android Tablet Build:
   ```bash
   ns build android --release --key-store-path ./keystore/tablet.keystore
   ```

### Eerste Start
1. Run installatie wizard:
   ```bash
   npm run setup
   ```
2. Volg de stappen in de wizard
3. Start de applicatie:
   ```bash
   npm run start:prod
   ```

## Beheerders Omgeving

### Configuratie
1. Login als admin
2. Configureer:
   - VoIP instellingen
   - SMS templates
   - Noodknop instellingen
   - Gebruikerslimieten

### Distributie Setup
1. Kies distributie type
2. Configureer branding
3. Stel gebruikerslimieten in
4. Test functionaliteit

## Support
Email: support@mantelzorgconnect.nl
Telefoon: [Support nummer]