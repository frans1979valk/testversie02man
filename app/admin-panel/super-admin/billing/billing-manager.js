class BillingManager {
    constructor() {
        this.distributions = [];
        this.rates = new Map();
        this.vatRate = 21;
        this.mollieConfig = {
            apiKey: '', // Vul hier je Mollie API key in
            testMode: true // Zet op false voor productie
        };
        this.initialize();
    }

    async initialize() {
        this.setupEventListeners();
        await this.loadDistributions();
        await this.loadRates();
        this.initializeMollieElements();
    }

    initializeMollieElements() {
        const paymentMethod = document.getElementById('paymentMethod');
        const mollieOptions = document.getElementById('mollieOptions');
        const mollieMethod = document.getElementById('mollieMethod');
        const idealBanks = document.querySelector('.ideal-banks');

        paymentMethod?.addEventListener('change', (e) => {
            mollieOptions.style.display = e.target.value === 'mollie' ? 'block' : 'none';
        });

        mollieMethod?.addEventListener('change', (e) => {
            idealBanks.style.display = e.target.value === 'ideal' ? 'block' : 'none';
        });
    }

    async addCredit(amount, distributionId, paymentData) {
        try {
            const distribution = this.distributions.find(d => d.id === distributionId);
            if (!distribution) throw new Error('Distributie niet gevonden');

            const vatAmount = amount * (this.vatRate / 100);
            const totalAmount = amount + vatAmount;

            if (paymentData.method === 'mollie') {
                const payment = await this.createMolliePayment({
                    amount: totalAmount,
                    description: `Beltegoed voor ${distribution.name}`,
                    distributionId,
                    mollieMethod: paymentData.mollieMethod,
                    idealBank: paymentData.idealBank
                });

                // Redirect naar Mollie betaalpagina
                if (payment.checkoutUrl) {
                    window.location.href = payment.checkoutUrl;
                    return;
                }
            } else {
                // Bestaande factuur logica
                await this.processInvoicePayment(amount, vatAmount, totalAmount, distributionId);
            }

            this.showSuccess('Beltegoed verwerking gestart');
            closeModal('creditModal');
        } catch (error) {
            console.error('Fout bij toevoegen beltegoed:', error);
            this.showError('Fout bij toevoegen beltegoed');
        }
    }

    async createMolliePayment(paymentData) {
        try {
            // In productie: Vervang door echte Mollie API call
            console.log('Mollie betaling aanmaken:', paymentData);
            
            // Simuleer API response
            return {
                id: 'tr_' + Date.now(),
                status: 'open',
                checkoutUrl: `https://www.mollie.com/checkout/test-${Date.now()}`,
                amount: {
                    value: paymentData.amount.toFixed(2),
                    currency: 'EUR'
                }
            };
        } catch (error) {
            console.error('Fout bij aanmaken Mollie betaling:', error);
            throw new Error('Betaling kon niet worden aangemaakt');
        }
    }

    async processInvoicePayment(amount, vatAmount, totalAmount, distributionId) {
        const invoice = {
            id: 'FACT-' + Date.now(),
            distributionId,
            subtotal: amount,
            vatRate: this.vatRate,
            vatAmount: vatAmount,
            totalAmount: totalAmount,
            date: new Date().toISOString(),
            status: 'in_behandeling',
            type: 'beltegoed'
        };

        const invoices = this.getInvoices();
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));

        await this.saveDistributions();
        this.renderInvoices();
        this.updateCreditInfo(distributionId);
    }

    async handleMollieWebhook(webhookData) {
        try {
            const payment = webhookData.payment;
            if (payment.status === 'paid') {
                // Verwerk succesvolle betaling
                await this.processMollieSuccess(payment);
            } else if (payment.status === 'failed' || payment.status === 'expired') {
                // Verwerk mislukte betaling
                await this.processMollieFailure(payment);
            }
        } catch (error) {
            console.error('Fout bij verwerken Mollie webhook:', error);
        }
    }

    // Rest van de code blijft hetzelfde...
}