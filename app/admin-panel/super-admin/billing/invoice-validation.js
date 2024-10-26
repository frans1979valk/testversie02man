// Factuur Validatie Service
class InvoiceValidationService {
    constructor() {
        this.validators = {
            company: this.validateCompanyInfo,
            amounts: this.validateAmounts,
            dates: this.validateDates,
            items: this.validateItems,
            vat: this.validateVatCalculations
        };
    }

    async validateInvoice(invoice) {
        const validationResults = await Promise.all([
            this.validators.company(invoice),
            this.validators.amounts(invoice),
            this.validators.dates(invoice),
            this.validators.items(invoice),
            this.validators.vat(invoice)
        ]);

        const errors = validationResults.filter(result => !result.valid);
        return {
            valid: errors.length === 0,
            errors: errors.map(error => error.message)
        };
    }

    async validateCompanyInfo(invoice) {
        const required = ['companyName', 'vatNumber', 'kvkNumber', 'address'];
        const missing = required.filter(field => !invoice[field]);

        if (missing.length > 0) {
            return {
                valid: false,
                message: `Ontbrekende bedrijfsgegevens: ${missing.join(', ')}`
            };
        }

        // Valideer BTW-nummer formaat
        const vatRegex = /^NL\d{9}B\d{2}$/;
        if (!vatRegex.test(invoice.vatNumber)) {
            return {
                valid: false,
                message: 'Ongeldig BTW-nummer formaat'
            };
        }

        // Valideer KvK-nummer
        const kvkRegex = /^\d{8}$/;
        if (!kvkRegex.test(invoice.kvkNumber)) {
            return {
                valid: false,
                message: 'Ongeldig KvK-nummer'
            };
        }

        return { valid: true };
    }

    async validateAmounts(invoice) {
        // Controleer of bedragen numeriek zijn
        if (typeof invoice.subtotal !== 'number' || 
            typeof invoice.vatAmount !== 'number' || 
            typeof invoice.totalAmount !== 'number') {
            return {
                valid: false,
                message: 'Ongeldige bedragen'
            };
        }

        // Controleer berekeningen
        const calculatedTotal = invoice.subtotal + invoice.vatAmount;
        if (Math.abs(calculatedTotal - invoice.totalAmount) > 0.01) {
            return {
                valid: false,
                message: 'Totaalbedrag komt niet overeen met subtotaal + BTW'
            };
        }

        return { valid: true };
    }

    async validateDates(invoice) {
        const today = new Date();
        const invoiceDate = new Date(invoice.invoiceDate);
        const dueDate = new Date(invoice.dueDate);

        // Factuur mag niet in de toekomst liggen
        if (invoiceDate > today) {
            return {
                valid: false,
                message: 'Factuurdatum mag niet in de toekomst liggen'
            };
        }

        // Vervaldatum moet na factuurdatum liggen
        if (dueDate <= invoiceDate) {
            return {
                valid: false,
                message: 'Vervaldatum moet na factuurdatum liggen'
            };
        }

        return { valid: true };
    }

    async validateItems(invoice) {
        if (!Array.isArray(invoice.items) || invoice.items.length === 0) {
            return {
                valid: false,
                message: 'Factuur moet minimaal één item bevatten'
            };
        }

        for (const item of invoice.items) {
            if (!item.description || 
                typeof item.quantity !== 'number' || 
                typeof item.price !== 'number' ||
                typeof item.vatRate !== 'number') {
                return {
                    valid: false,
                    message: 'Ongeldig factuuritem'
                };
            }
        }

        return { valid: true };
    }

    async validateVatCalculations(invoice) {
        let calculatedVat = 0;
        
        // Bereken BTW per item
        for (const item of invoice.items) {
            const lineAmount = item.quantity * item.price;
            calculatedVat += (lineAmount * item.vatRate) / 100;
        }

        // Vergelijk berekende BTW met factuur BTW
        if (Math.abs(calculatedVat - invoice.vatAmount) > 0.01) {
            return {
                valid: false,
                message: 'BTW berekening klopt niet'
            };
        }

        return { valid: true };
    }
}

// Initialize validation service
const invoiceValidation = new InvoiceValidationService();