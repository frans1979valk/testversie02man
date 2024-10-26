// Contact foto's beheer voor beheerders
class ContactPhotoManager {
    constructor() {
        this.maxFileSize = 200 * 1024; // 200KB
        this.supportedFormats = ['image/jpeg', 'image/png'];
        this.photoSize = { width: 400, height: 400 };
        this.initialize();
    }

    async initialize() {
        try {
            // Check of feature is ingeschakeld voor deze distributie
            const distributionId = localStorage.getItem('currentDistributionId');
            const distribution = await this.getDistributionSettings(distributionId);

            if (!distribution?.features?.contactPhotos) {
                document.getElementById('featureDisabled').style.display = 'block';
                document.getElementById('photoManager').style.display = 'none';
                return;
            }

            // Laad bestaande foto's
            await this.loadExistingPhotos();
        } catch (error) {
            console.error('Initialisatie fout:', error);
            this.showError('Kan foto beheer niet initialiseren');
        }
    }

    async getDistributionSettings(distributionId) {
        // In productie: Haal settings op van API
        const distributions = JSON.parse(localStorage.getItem('distributions') || '[]');
        return distributions.find(d => d.id === distributionId);
    }

    async loadExistingPhotos() {
        const photoTypes = ['fiberSupport', 'internetSupport', 'tvSupport', 'generalSupport'];
        
        for (const type of photoTypes) {
            const photoData = localStorage.getItem(`contact_photo_${type}`);
            if (photoData) {
                document.getElementById(`${type}Preview`).src = photoData;
            }
        }
    }

    async updatePhoto(contactType, fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        try {
            // Valideer bestand
            await this.validatePhoto(file);

            // Verwerk foto
            const processedImage = await this.processPhoto(file);

            // Update preview
            const previewId = `${contactType}Preview`;
            document.getElementById(previewId).src = processedImage;

            // Sla foto op
            await this.savePhoto(contactType, processedImage);

            this.showSuccess('Foto succesvol bijgewerkt');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async validatePhoto(file) {
        // Check bestandsgrootte
        if (file.size > this.maxFileSize) {
            throw new Error('Bestand is te groot. Maximum is 200KB');
        }

        // Check bestandsformaat
        if (!this.supportedFormats.includes(file.type)) {
            throw new Error('Ongeldig bestandsformaat. Gebruik JPG of PNG');
        }

        // Check afmetingen
        const dimensions = await this.getImageDimensions(file);
        if (dimensions.width < this.photoSize.width || dimensions.height < this.photoSize.height) {
            throw new Error(`Afbeelding moet minimaal ${this.photoSize.width}x${this.photoSize.height} pixels zijn`);
        }
    }

    getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => reject(new Error('Kan afbeelding niet laden'));
            img.src = URL.createObjectURL(file);
        });
    }

    async processPhoto(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = this.photoSize.width;
            canvas.height = this.photoSize.height;

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Teken foto in canvas met juiste formaat
                    ctx.drawImage(img, 0, 0, this.photoSize.width, this.photoSize.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };
                img.onerror = () => reject(new Error('Kan afbeelding niet verwerken'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Kan bestand niet lezen'));
            reader.readAsDataURL(file);
        });
    }

    async savePhoto(contactType, imageData) {
        try {
            // Sla foto op in lokale opslag
            localStorage.setItem(`contact_photo_${contactType}`, imageData);

            // In productie: Upload naar server
            await this.uploadToServer(contactType, imageData);
        } catch (error) {
            console.error('Fout bij opslaan foto:', error);
            throw new Error('Kan foto niet opslaan');
        }
    }

    async uploadToServer(contactType, imageData) {
        // Implementeer server upload
        console.log(`Uploading ${contactType} photo to server...`);
    }

    showSuccess(message) {
        alert(message); // In productie: Gebruik mooiere notificatie
    }

    showError(message) {
        alert('Fout: ' + message); // In productie: Gebruik mooiere notificatie
    }
}

// Initialize photo manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.photoManager = new ContactPhotoManager();
});