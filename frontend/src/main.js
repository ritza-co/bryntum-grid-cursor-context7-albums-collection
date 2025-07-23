import { Grid } from '@bryntum/grid';
import { gridConfig } from './gridConfig.js';
import './style.css';

// Helper functions for grid operations
function addAlbum(grid) {
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
        const record = grid.store.add(newAlbum)[0];
        
        console.log('Album created:', record.data);
        
        // Select the new record for editing
        grid.selectRow(record);
        
    } catch (error) {
        console.error('Error adding album:', error);
        showError('Failed to add new album.');
    }
}

function deleteSelected(grid) {
    const selectedRecords = grid.selectedRecords;
    
    if (selectedRecords.length === 0) {
        return;
    }

    const confirmation = confirm(`Are you sure you want to delete ${selectedRecords.length} album(s)?`);
    if (!confirmation) {
        return;
    }

    try {
        // Use AjaxStore's built-in remove functionality
        grid.store.remove(selectedRecords);
        
        console.log(`${selectedRecords.length} album(s) deleted`);
        
    } catch (error) {
        console.error('Error deleting albums:', error);
        showError('Failed to delete selected albums.');
        // Reload data to ensure consistency
        refreshData(grid);
    }
}

async function refreshData(grid) {
    try {
        console.log('Refreshing albums data...');
        await grid.store.load();
        console.log(`Loaded ${grid.store.count} albums`);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load albums data. Please check if the backend server is running.');
    }
}

function updateAlbum({ record }) {
    // With autoCommit: true, changes are automatically saved
    console.log('Album updated:', record.data);
}

function showError(message) {
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

// Create the grid following the pattern from cursor rules
const grid = new Grid(gridConfig);

// Attach helper functions to grid instance for toolbar access
grid.addAlbum = () => addAlbum(grid);
grid.deleteSelected = () => deleteSelected(grid);
grid.refreshData = () => refreshData(grid);
grid.updateAlbum = updateAlbum; 