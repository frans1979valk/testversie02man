// Camera tarieven beheer
class CameraPricingManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadPricingSettings();
    }

    setupEventListeners() {
        // Switch tussen abonnement en verbruik
        document.querySelectorAll('input[name="pricingModel"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePricingModel(e.target.value);
            });
        });

        // Valideer prijsinvoer
        document.querySelectorAll('.price-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.validatePrice(e.target);
            });
        });
    }

    togglePricingModel(model) {
        const subscriptionDiv = document.getElementById('subscriptionPricing');
        const usageDiv = document.getElementById('usagePricing');

        if (model === 'subscription') {
            subscriptionDiv.style.display = 'block';
            usageDiv.style.display = 'none';
        } else {
            subscriptionDiv.style.display = 'none';
            usageDiv.style.display = 'block';
        }
    }

    validatePrice(input) {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0) {
            input.value = 0;
        }
    }

    async savePricingSettings() {
        const settings = {
            model: document.querySelector('input[name="pricingModel"]:checked').value,
            subscription: {
                camera: parseFloat(document.getElementById('cameraPriceMonth').value),
                doorbell: parseFloat(document.getElementById('doorbellPriceMonth').value)
            },
            usage: {
                camera: parseFloat(document.getElementById('cameraPriceMinute').value),
                doorbell: parseFloat(document.getElementById('doorbellPriceMinute').value)
            },
            discounts: {
                multiCamera: parseFloat(document.getElementById('multiCameraDiscount').value),
                yearly: parseFloat(document.getElementById('yearlyDiscount').value)
            }
        };

        try {
            await this.savePricing(settings);
            this.showSuccess('Tarieven succesvol opgeslagen');
        } catch (error) {
            this.showError('Fout bij opslaan tarieven');
        }
    }

    async loadPricingSettings() {
        try {
            const settings = await this.loadPricing();
            if (settings) {
                // Vul formulier met opgeslagen waardes
                document.querySelector(`input[name="pricingModel"][value="${settings.model}"]`).checked = true;
                this.togglePricingModel(settings.model);

                document.getElementById('cameraPriceMonth').value = settings.subscription.camera;
                document.getElementById('doorbellPriceMonth').value = settings.subscription.doorbell;
                document.getElementById('cameraPriceMinute').value = settings.usage.camera;
                document.getElementById('doorbellPriceMinute').value = settings.usage.doorbell;
                document.getElementById('multiCameraDiscount').value = settings.discounts.multiCamera;
                document.getElementById('yearlyDiscount').value = settings.discounts.yearly;
            }
        } catch (error) {
            console.error('Fout bij laden tarieven:', error);
        }
    }

    calculatePrice(type, quantity, duration) {
        const settings = this.loadPricing();
        const basePrice = settings.model === 'subscription' 
            ? settings.subscription[type] * duration
            : settings.usage[type] * duration;

        // Bereken kortingen
        let discount = 0;
        if (quantity > 1) {
            discount += settings.discounts.multiCamera;
        }
        if (duration >= 12) {
            discount += settings.discounts.yearly;
        }

        const finalPrice = basePrice * (1 - (discount / 100));
        return {
            basePrice,
            discount,
            finalPrice
        };
    }

    async savePricing(settings) {
        // In productie: Sla op in database
        localStorage.setItem('camera_pricing', JSON.stringify(settings));
    }

    async loadPricing() {
        // In productie: Laad van database
        const saved = localStorage.getItem('camera_pricing');
        return saved ? JSON.parse(saved) : null;
    }

    showSuccess(message) {
        alert(message); // In productie: Gebruik mooiere notificatie
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Gebruik mooiere notificatie
    }
}

// Initialize pricing manager
const cameraPricing = new CameraPricingManager();

// Helper functie voor opslaan
function savePricingSettings() {
    cameraPricing.savePricingSettings();
}