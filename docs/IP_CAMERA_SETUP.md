# IP Camera Setup Handleiding

## Vereisten

### Netwerk Configuratie
1. **Vast IP Adres**
   - De camera MOET een vast IP adres hebben in het lokale netwerk
   - Dit kan worden ingesteld via:
     * De camera's eigen configuratie interface
     * DHCP reservering in de router
   - Voorkom IP conflicten door een adres buiten het DHCP bereik te kiezen

2. **Netwerk Toegang**
   - De camera moet toegankelijk zijn binnen het lokale netwerk
   - Controleer of de benodigde poorten open staan (meestal 554 voor RTSP)
   - Zorg dat de camera en de MantelzorgConnect app in hetzelfde netwerk zitten

### Camera Inloggegevens
1. **Verplichte Gegevens**
   - Gebruikersnaam van de camera
   - Wachtwoord van de camera
   - Deze gegevens zijn meestal:
     * Te vinden in de handleiding van de camera
     * De standaard inloggegevens van de fabrikant
     * Door de installateur ingesteld

2. **Veiligheidsadvies**
   - Wijzig standaard wachtwoorden
   - Gebruik sterke wachtwoorden
   - Bewaar de inloggegevens op een veilige plek

## Ondersteunde Camera Types

1. **RTSP Cameras**
   - Meest voorkomende type
   - Beste kwaliteit en laagste vertraging
   - Standaard poort: 554

2. **HTTP Cameras**
   - Via web interface
   - Standaard poort: 80 of 8080
   - Mogelijk hogere vertraging

3. **ONVIF Cameras**
   - Industriestandaard
   - Automatische detectie mogelijk
   - Standaard poort: 80

## Stap-voor-stap Setup

1. **Camera Installatie**
   ```
   1. Sluit de camera aan op het netwerk
   2. Stel een vast IP adres in
   3. Noteer de inloggegevens
   4. Test de camera via de web interface
   ```

2. **MantelzorgConnect Configuratie**
   ```
   1. Ga naar Camera Instellingen
   2. Klik op 'Camera Toevoegen'
   3. Vul in:
      - Naam voor de camera
      - Het vaste IP adres
      - De juiste poort
      - Type camera (RTSP/HTTP/ONVIF)
      - Gebruikersnaam
      - Wachtwoord
   4. Test de verbinding
   ```

## Probleemoplossing

### Veelvoorkomende Problemen
1. **Geen verbinding**
   - Controleer of het IP adres correct is
   - Verifieer de inloggegevens
   - Test of de camera bereikbaar is via ping

2. **Zwart beeld**
   - Controleer of de camera stroom heeft
   - Verifieer de stream URL
   - Test de camera via de eigen interface

3. **Vertraagde beelden**
   - Controleer de netwerksnelheid
   - Verlaag eventueel de resolutie
   - Gebruik bij voorkeur een bekabelde verbinding

### Checklist bij Problemen
- [ ] Camera heeft stroom
- [ ] Netwerkkabel is aangesloten
- [ ] IP adres is correct
- [ ] Inloggegevens zijn juist
- [ ] Poorten zijn open
- [ ] Camera is bereikbaar via ping
- [ ] Camera werkt via eigen interface

## Ondersteunde Camera Merken
- Hikvision
- Dahua
- Axis
- Reolink
- Foscam
- En andere RTSP/ONVIF compatibele camera's

## Support
Bij problemen met de camera setup:
- Email: support@mantelzorgconnect.nl
- Telefoon: [Support nummer]
- Bereikbaarheid: Ma-Vr, 9:00-17:00