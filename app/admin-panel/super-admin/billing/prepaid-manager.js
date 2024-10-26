// Prepaid systeem voor VoIP en SMS
class PrepaidManager {
    constructor() {
        this.rates = {
            voip: {
                local: 0.05,    // €0.05 per minuut lokaal
                mobile: 0.10,   // €0.10 per minuut mobiel
                minimum: 5.00   // Minimum opwaardeerbedrag
            },
            sms: {
                local: 0.09,    // €0.09 per SMS lokaal (aangepast)
                minimum: 5.00   // Minimum opwaardeerbedrag
            }
        };
        this.initialize();
    }
    // ... rest van de code blijft hetzelfde
}