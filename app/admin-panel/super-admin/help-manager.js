// Help System Manager
class HelpManager {
    constructor() {
        this.helpEnabled = this.loadHelpPreference();
        this.helpContent = {
            distributions: {
                title: 'Distributies Beheren',
                content: `
                    <h4>Een nieuwe distributie aanmaken:</h4>
                    <ol>
                        <li>Klik op de "Nieuwe Distributie" knop rechtsboven</li>
                        <li>Vul de volgende gegevens in:
                            <ul>
                                <li>Naam: De naam van de distributie (bijv. "VIP Installatie")</li>
                                <li>Domein: Het domein voor deze distributie</li>
                                <li>Primaire Kleur: De hoofdkleur voor de huisstijl</li>
                                <li>Logo: Upload het bedrijfslogo</li>
                            </ul>
                        </li>
                        <li>Klik op "Aanmaken" om de distributie op te slaan</li>
                    </ol>

                    <h4>Distributie instellingen:</h4>
                    <ul>
                        <li>VoIP configuratie per distributie</li>
                        <li>Gebruikerslimieten instellen</li>
                        <li>Email templates aanpassen</li>
                        <li>Activatie instellingen beheren</li>
                    </ul>

                    <h4>Beheer opties:</h4>
                    <ul>
                        <li>Bewerken: Pas instellingen aan</li>
                        <li>Statistieken: Bekijk gebruiksgegevens</li>
                        <li>Activeren/Deactiveren: Beheer beschikbaarheid</li>
                    </ul>`
            },
            globalSettings: {
                title: 'Globale VoIP Instellingen',
                content: `Deze instellingen gelden als standaard voor alle distributies. Per distributie kunnen deze worden aangepast:
                    <ul>
                        <li>Schakel VoIP in/uit voor het hele systeem</li>
                        <li>Configureer standaard server instellingen</li>
                        <li>Beheer codec voorkeuren</li>
                        <li>Stel beveiligingsopties in</li>
                    </ul>`
            },
            serverConfig: {
                title: 'Server Configuratie',
                content: `
                    <ul>
                        <li><strong>Primaire SIP Server:</strong> Hoofdserver voor VoIP verbindingen (voip.cheapconnect.net)</li>
                        <li><strong>Alternatieve Server:</strong> Reserve server bij verbindingsproblemen (sip.cheapconnect.net)</li>
                        <li><strong>SIP Poort:</strong> Standaard is 5060, maar 5080 wordt aanbevolen om SIP ALG te omzeilen</li>
                        <li><strong>Ondersteunde Poorten:</strong> 5060, 5070, 5072, 5074, 5076, 5078, 5080</li>
                    </ul>`
            },
            codecSettings: {
                title: 'Codec Instellingen',
                content: `
                    <ul>
                        <li><strong>G.711A (alaw):</strong> Beste geluidskwaliteit, gebruikt meer bandbreedte</li>
                        <li><strong>G.729A/B:</strong> Goede compressie, gebruikt minder bandbreedte</li>
                    </ul>
                    De volgorde bepaalt welke codec eerst wordt geprobeerd.`
            },
            advancedSettings: {
                title: 'Geavanceerde Instellingen',
                content: `
                    <ul>
                        <li><strong>DTMF Mode:</strong> RFC2833 is de aanbevolen instelling</li>
                        <li><strong>STUN/TURN:</strong> Uitschakelen aanbevolen, alleen nodig bij specifieke netwerken</li>
                        <li><strong>SIP ALG Bypass:</strong> Voorkomt problemen met bepaalde routers</li>
                        <li><strong>Registratie Timeout:</strong> Standaard 3600 seconden (minimaal 300)</li>
                    </ul>`
            },
            distributionSettings: {
                title: 'Distributie-specifieke Instellingen',
                content: `Instellingen per distributie:
                    <ul>
                        <li><strong>SIP Gebruikersnaam Voorvoegsel:</strong> Voorvoegsel voor SIP accounts (bijv. 31453)</li>
                        <li><strong>Nummerweergave:</strong> Voorvoegsel voor uitgaande gesprekken (+31453)</li>
                        <li><strong>Maximum Gesprekken:</strong> Maximaal aantal gelijktijdige gesprekken</li>
                        <li><strong>VoIP Activatie:</strong> Schakel VoIP in/uit voor deze distributie</li>
                    </ul>
                    
                    <h4>Stappenplan voor distributie setup:</h4>
                    1. Maak de distributie aan
                    2. Configureer de VoIP instellingen
                    3. Stel gebruikerslimieten in
                    4. Pas email templates aan
                    5. Test de configuratie
                    6. Activeer de distributie`
            }
        };
        this.initialize();
    }

    // Rest van de code blijft hetzelfde
}