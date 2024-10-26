# Simpele Test Handleiding - Super Admin Omgeving

## Voorbereiding
1. Zorg dat je hebt:
   - Een computer met internet
   - Google Chrome (aanbevolen browser)
   - Super admin inloggegevens
   - Test distributie gegevens

## Test 1: Super Admin Login
1. Ga naar de super admin website
2. Vul je gebruikersnaam in
3. Vul je wachtwoord in
4. Klik op 'Inloggen'
5. ✅ Afvinken als je het dashboard ziet

## Test 2: Distributie Aanmaken
1. Klik op 'Nieuwe Distributie'
2. Vul de testgegevens in:
   - Naam: Test Distributie
   - Domein: test.vip-installatie.nl
   - Kies een kleur
3. Upload een logo (indien beschikbaar)
4. Klik op 'Aanmaken'
5. ✅ Afvinken als de distributie is aangemaakt

## Test 3: VoIP Instellingen
1. Ga naar 'VoIP Instellingen'
2. Controleer de standaard instellingen:
   - Server: voip.cheapconnect.net
   - Poort: 5080
   - Gebruikersnaam: 31453690196
3. Sla de instellingen op
4. ✅ Afvinken als de instellingen zijn opgeslagen

## Test 4: Facturatie Instellen
1. Selecteer een distributie
2. Ga naar 'Facturatie'
3. Stel tarieven in:
   - Belkosten per minuut
   - SMS kosten
   - BTW percentage (21%)
4. Klik op 'Opslaan'
5. ✅ Afvinken als de tarieven zijn ingesteld

## Test 5: Beheerder Toevoegen
1. Selecteer een distributie
2. Klik op 'Beheerders'
3. Klik op 'Nieuwe Beheerder'
4. Vul de gegevens in:
   - Naam: Test Beheerder
   - Email: beheerder@test.com
   - Wachtwoord
5. ✅ Afvinken als de beheerder is toegevoegd

## Wat te doen bij problemen?

### Als een distributie niet aangemaakt kan worden:
1. Check of de domeinnaam uniek is
2. Controleer het logo formaat
3. Kijk of alle verplichte velden zijn ingevuld
4. Maak screenshots van foutmeldingen

### Als VoIP niet werkt:
1. Controleer de server instellingen
2. Test de verbinding
3. Check firewall instellingen
4. Neem contact op met VoIP provider

### Als facturatie niet werkt:
1. Controleer de BTW instellingen
2. Check de tarieven
3. Controleer de Mollie integratie
4. Bekijk de error logs

## Test Resultaten Bijhouden

| Test                  | Werkt het? | Opmerkingen |
|----------------------|------------|-------------|
| Super Admin Login    | ⬜         |             |
| Distributie aanmaken | ⬜         |             |
| VoIP instellingen    | ⬜         |             |
| Facturatie          | ⬜         |             |
| Beheerder toevoegen | ⬜         |             |

## Belangrijke punten
1. Test ALTIJD eerst in een testomgeving
2. Maak backups voor grote wijzigingen
3. Documenteer alle aanpassingen
4. Monitor de error logs

## Support
- Technische support: tech@vip-installatie.nl
- VoIP support: voip@cheapconnect.net
- Bereikbaarheid: 24/7 voor kritieke issues

## Na het testen
1. Vul alle testresultaten in
2. Documenteer gevonden problemen
3. Maak een backup van de configuratie
4. Plan eventuele fixes