// Voeg deze functie toe aan de DistributionManager class
async updateDistributionFeatures(distributionId, features) {
    try {
        const distribution = this.distributions.find(d => d.id === distributionId);
        if (!distribution) return;

        distribution.features = {
            ...distribution.features,
            ...features
        };
        
        await this.saveDistributions();
        this.renderDistributions();
        
        return true;
    } catch (error) {
        console.error('Fout bij updaten distributie features:', error);
        return false;
    }
}

// Update de createDistributionCard functie
createDistributionCard(dist) {
    return `
        <div class="card" data-id="${dist.id}">
            <!-- Bestaande card header en info -->
            
            <div class="features-section">
                <h4>Features</h4>
                <div class="feature-toggles">
                    <label class="feature-toggle">
                        <span>Contact Foto's</span>
                        <input type="checkbox" 
                               ${dist.features?.contactPhotos ? 'checked' : ''} 
                               onchange="distributionManager.updateDistributionFeatures('${dist.id}', {
                                   contactPhotos: this.checked
                               })">
                        <span class="toggle-slider"></span>
                    </label>
                    <!-- Andere feature toggles hier -->
                </div>
            </div>
            
            <!-- Bestaande card footer -->
        </div>
    `;
}