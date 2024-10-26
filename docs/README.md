# VIP Installatie Applicatie

## Overzicht
VIP Installatie is een uitgebreide communicatie-oplossing voor installatiebedrijven met de volgende hoofdfuncties:

- VoIP telefonie integratie
- SMS functionaliteit
- Multi-distributie ondersteuning
- Gebruikersbeheer met VIP niveaus
- Facturatie en beltegoed systeem
- Kiosk modus voor vaste installaties

### Architectuur
- Mobile App (NativeScript)
- Web App (Progressive Web App)
- Admin Panel (Beheerders omgeving)
- Super Admin Panel (Multi-distributie beheer)
- Database (SQLite/PostgreSQL)

## Systeemvereisten

### Server
- Node.js 14+
- 1GB vrije schijfruimte
- SQLite of PostgreSQL database
- SSL certificaat voor productie

### Client (Mobile App)
- Android 8.0+
- 100MB vrije ruimte
- Microfoon en telefoon permissies
- Bluetooth (optioneel)

## Installatie
Zie [INSTALL.md](./INSTALL.md) voor gedetailleerde installatie-instructies.

## Functionaliteiten

### VoIP Integratie
- SIP server configuratie
- Codec instellingen (G.711A, G.729A/B)
- Fallback naar GSM
- Audio kwaliteit optimalisatie

### SMS Systeem
- Template berichten
- Bulk SMS
- SMS geschiedenis
- Limieten per gebruiker

### Gebruikersniveaus
1. VIP Niveau 1
   - Basis functionaliteit
   - Standaard limieten
2. VIP Niveau 2
   - Uitgebreide functionaliteit
   - Verhoogde limieten
3. VIP Niveau 3
   - Premium functionaliteit
   - Maximale limieten

### Facturatie
- BTW berekening (21%)
- Factuur templates
- Mollie integratie
- Automatische facturatie

### Beveiliging
- 2FA ondersteuning
- IP whitelisting
- Sessie beheer
- Audit logging

## Bekende Problemen

### VoIP
- SIP ALG kan problemen veroorzaken op sommige routers
- Audio latency op zwakke netwerken
- Echo bij bepaalde apparaten

### Mobile App
- Batterij verbruik in kiosk modus
- Permissie problemen op Android 12+
- Background service beperkingen

### Web App
- Audio initialisatie vereist gebruikersinteractie
- WebRTC compatibiliteit verschilt per browser
- PWA beperkingen op iOS

### Database
- SQLite limieten bij veel gelijktijdige gebruikers
- Backup tijdens gebruik kan traag zijn
- Migraties kunnen tijd kosten

## Onderhoud

### Backup
- Dagelijkse database backup
- Configuratie backup
- Factuur archivering (7 jaar)

### Monitoring
- Error logging
- Gebruiksstatistieken
- Performance metrics
- API health checks

### Updates
- Automatische updates mogelijk
- Rollback functionaliteit
- Gefaseerde uitrol

## Support
Email: support@vip-installatie.nl
Telefoon: +31453690196