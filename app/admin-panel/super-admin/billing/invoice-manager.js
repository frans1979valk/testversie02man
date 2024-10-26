// Facturatie Manager
class InvoiceManager {
    constructor() {
        this.vatRate = 21; // BTW percentage
        this.vatTypes = {
            HIGH: 21,    // Hoog tarief
            LOW: 9,      // Laag tarief
            ZERO: 0,     // 0% tarief
            EXEMPT: -1   // Vrijgesteld
        };
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadInvoiceTemplates();
    }

    setupEventListeners() {
        document.getElementById('createInvoiceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createInvoice();
        });
    }

    validateInvoiceRequirements(invoice) {
        const required = [
            'invoiceNumber',      // Uniek factuurnummer
            'invoiceDate',        // Factuurdatum
            'companyName',        // Bedrijfsnaam
            'vatNumber',          // BTW-nummer
            'kvkNumber',          // KvK-nummer
            'address',            // Volledig adres
            'items',              // Factuurregels
            'vatAmount',          // BTW bedrag
            'totalAmount',        // Totaalbedrag
            'paymentTerms',       // Betalingstermijn
            'bankAccount'         // Bankgegevens
        ];

        const missing = required.filter(field => !invoice[field]);
        if (missing.length > 0) {
            throw new Error(`Verplichte velden ontbreken: ${missing.join(', ')}`);
        }

        // Valideer BTW-nummer formaat
        if (!this.validateVatNumber(invoice.vatNumber)) {
            throw new Error('Ongeldig BTW-nummer formaat');
        }

        // Valideer KvK-nummer
        if (!this.validateKvKNumber(invoice.kvkNumber)) {
            throw new Error('Ongeldig KvK-nummer');
        }

        // Valideer berekeningen
        if (!this.validateCalculations(invoice)) {
            throw new Error('BTW berekeningen kloppen niet');
        }

        return true;
    }

    validateVatNumber(vatNumber) {
        // Nederlands BTW-nummer formaat: NLxxxxxxxxB01
        const vatRegex = /^NL\d{9}B\d{2}$/;
        return vatRegex.test(vatNumber);
    }

    validateKvKNumber(kvkNumber) {
        // KvK-nummer moet 8 cijfers zijn
        const kvkRegex = /^\d{8}$/;
        return kvkRegex.test(kvkNumber);
    }

    validateCalculations(invoice) {
        let calculatedVat = 0;
        let calculatedTotal = 0;

        // Bereken BTW en totaal per regel
        invoice.items.forEach(item => {
            const lineAmount = item.quantity * item.price;
            const lineVat = this.calculateVat(lineAmount, item.vatRate);
            
            calculatedVat += lineVat;
            calculatedTotal += lineAmount + lineVat;
        });

        // Vergelijk met factuur totalen (marge van 0.01 voor afrondingsverschillen)
        return Math.abs(calculatedVat - invoice.vatAmount) < 0.01 &&
               Math.abs(calculatedTotal - invoice.totalAmount) < 0.01;
    }

    calculateVat(amount, vatRate) {
        if (vatRate === this.vatTypes.EXEMPT) return 0;
        return (amount * vatRate) / 100;
    }

    async createInvoice(data) {
        try {
            const invoice = {
                invoiceNumber: this.generateInvoiceNumber(),
                invoiceDate: new Date().toISOString(),
                dueDate: this.calculateDueDate(30), // 30 dagen betalingstermijn
                ...data,
                status: 'concept'
            };

            // Valideer factuur
            this.validateInvoiceRequirements(invoice);

            // Bereken BTW en totalen
            invoice.subtotal = this.calculateSubtotal(invoice.items);
            invoice.vatAmount = this.calculateTotalVat(invoice.items);
            invoice.totalAmount = invoice.subtotal + invoice.vatAmount;

            // Sla factuur op
            await this.saveInvoice(invoice);

            // Genereer PDF
            await this.generateInvoicePDF(invoice);

            // Archiveer factuur
            await this.archiveInvoice(invoice);

            return invoice;
        } catch (error) {
            console.error('Fout bij aanmaken factuur:', error);
            throw error;
        }
    }

    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const sequence = this.getNextSequenceNumber();
        return `${year}${sequence.toString().padStart(6, '0')}`;
    }

    calculateDueDate(paymentTermDays) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + paymentTermDays);
        return dueDate.toISOString();
    }

    calculateSubtotal(items) {
        return items.reduce((total, item) => 
            total + (item.quantity * item.price), 0);
    }

    calculateTotalVat(items) {
        return items.reduce((total, item) => {
            const lineAmount = item.quantity * item.price;
            return total + this.calculateVat(lineAmount, item.vatRate);
        }, 0);
    }

    async saveInvoice(invoice) {
        // Sla factuur op in lokale opslag
        const invoices = this.getInvoices();
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));

        // In productie: Sla op in database
        return invoice;
    }

    async generateInvoicePDF(invoice) {
        // Implementeer PDF generatie met correcte factuurvereisten
        const template = this.getInvoiceTemplate();
        
        // Voeg verplichte elementen toe
        const requiredElements = {
            companyInfo: {
                name: invoice.companyName,
                vatNumber: invoice.vatNumber,
                kvkNumber: invoice.kvkNumber,
                address: invoice.address
            },
            invoiceDetails: {
                number: invoice.invoiceNumber,
                date: invoice.invoiceDate,
                dueDate: invoice.dueDate
            },
            paymentInfo: {
                bankAccount: invoice.bankAccount,
                paymentTerms: invoice.paymentTerms
            },
            vatSpecification: this.generateVatSpecification(invoice.items)
        };

        // In productie: Genereer PDF met alle verplichte elementen
        console.log('PDF template geladen met verplichte elementen:', requiredElements);
    }

    generateVatSpecification(items) {
        // Groepeer items per BTW-tarief
        const vatGroups = items.reduce((groups, item) => {
            const rate = item.vatRate;
            if (!groups[rate]) {
                groups[rate] = {
                    baseAmount: 0,
                    vatAmount: 0
                };
            }
            const lineAmount = item.quantity * item.price;
            groups[rate].baseAmount += lineAmount;
            groups[rate].vatAmount += this.calculateVat(lineAmount, rate);
            return groups;
        }, {});

        return Object.entries(vatGroups).map(([rate, amounts]) => ({
            rate: parseInt(rate),
            baseAmount: amounts.baseAmount,
            vatAmount: amounts.vatAmount
        }));
    }

    async archiveInvoice(invoice) {
        // Archiveer factuur volgens wettelijke bewaartermijn (7 jaar)
        const archive = {
            invoice: invoice,
            archiveDate: new Date().toISOString(),
            retentionPeriod: {
                years: 7,
                expiryDate: this.calculateRetentionExpiryDate(7)
            },
            audit: {
                created: new Date().toISOString(),
                createdBy: 'system',
                modifications: []
            }
        };

        // In productie: Sla archief op in beveiligde opslag
        console.log('Factuur gearchiveerd:', archive);
    }

    calculateRetentionExpiryDate(years) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + years);
        return expiryDate.toISOString();
    }

    getInvoices() {
        return JSON.parse(localStorage.getItem('invoices') || '[]');
    }

    getNextSequenceNumber() {
        const invoices = this.getInvoices();
        const currentYear = new Date().getFullYear().toString();
        const yearInvoices = invoices.filter(inv => 
            inv.invoiceNumber.startsWith(currentYear));
        return yearInvoices.length + 1;
    }

    loadInvoiceTemplates() {
        // Laad factuur templates met correcte opmaak volgens wetgeving
        this.templates = {
            default: {
                // Template structuur met alle verplichte elementen
                header: {
                    logo: true,
                    companyInfo: true,
                    invoiceTitle: true
                },
                body: {
                    customerInfo: true,
                    invoiceDetails: true,
                    items: true,
                    vatSpecification: true
                },
                footer: {
                    paymentInfo: true,
                    terms: true,
                    legalInfo: true
                }
            }
        };
    }

    getInvoiceTemplate() {
        return this.templates.default;
    }
}

// Initialize invoice manager
const invoiceManager = new InvoiceManager();