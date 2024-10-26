// Contact foto's beheer
class ContactPhotoManager {
    constructor() {
        this.maxFileSize = 200 * 1024; // 200KB
        this.supportedFormats = ['image/jpeg', 'image/png'];
        this.photoSize = { width: 400, height: 400 };
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
        // In productie: Sla foto op in opslag/database
        localStorage.setItem(`contact_photo_${contactType}`, imageData);
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
    window.contactPhotoManager = new ContactPhotoManager();
});