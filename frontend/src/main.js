import { Grid } from '@bryntum/grid';
import { gridConfig } from './gridConfig.js';
import './style.css';

class AlbumsGrid extends Grid {
    
    async addAlbum() {
        try {
            const newAlbum = {
                title: 'New Album',
                artist: 'New Artist',
                genre: 'Unknown',
                year: new Date().getFullYear(),
                duration: 40,
                rating: 5.0,
                label: 'Independent',
                price: 9.99
            };

            // Use AjaxStore's built-in add functionality
            const record = this.store.add(newAlbum)[0];
            
            // Commit the new record to the backend
            await this.store.commit();
            
            console.log('Album created:', record.data);
            
            // Select the new record for editing
            this.selectRow(record);
            
        } catch (error) {
            console.error('Error adding album:', error);
            this.showError('Failed to add new album.');
        }
    }

    async deleteSelected() {
        const selectedRecords = this.selectedRecords;
        
        if (selectedRecords.length === 0) {
            return;
        }

        const confirmation = confirm(`Are you sure you want to delete ${selectedRecords.length} album(s)?`);
        if (!confirmation) {
            return;
        }

        try {
            // Use AjaxStore's built-in remove functionality
            this.store.remove(selectedRecords);
            
            // Commit the deletions to the backend
            await this.store.commit();
            
            console.log(`${selectedRecords.length} album(s) deleted`);
            
        } catch (error) {
            console.error('Error deleting albums:', error);
            this.showError('Failed to delete selected albums.');
            // Reload data to ensure consistency
            await this.refreshData();
        }
    }

    async refreshData() {
        try {
            console.log('Refreshing albums data...');
            await this.store.load();
            console.log(`Loaded ${this.store.count} albums`);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load albums data. Please check if the backend server is running.');
        }
    }

    async updateAlbum({ record }) {
        try {
            // AjaxStore will automatically handle the update when we commit
            await this.store.commit();
            console.log('Album updated:', record.data);
        } catch (error) {
            console.error('Error updating album:', error);
            this.showError('Failed to update album.');
            // Reload data to revert changes
            await this.refreshData();
        }
    }

    showError(message) {
        // Simple error display - in a real app you might use a more sophisticated notification system
        const appContainer = document.querySelector('#app');
        appContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px; text-align: center; color: #f44336;">
                <div>
                    <h3>❌ Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            </div>
        `;
    }
}

// Create the grid following the pattern from cursor rules
const grid = new AlbumsGrid(gridConfig); 