import { StringHelper } from '@bryntum/grid';

export const gridConfig = {
    appendTo: 'app',
    
    // Store configuration with AjaxStore
    store: {
        createUrl: 'http://localhost:3001/api/albums',
        readUrl: 'http://localhost:3001/api/albums',
        updateUrl: 'http://localhost:3001/api/albums',
        deleteUrl: 'http://localhost:3001/api/albums',
        autoLoad: true,
        autoCommit: false,
        
        useRestfulMethods: true,
        httpMethods: {
            read: 'GET',
            create: 'POST',
            update: 'PUT',
            delete: 'DELETE'
        }
    },
    
    // Grid configuration
    autoHeight: false,
    flex: 1,
    
    // Enable editing and selection
    readOnly: false,
    multiSelect: true,
    
    // Toolbar with CRUD buttons
    tbar: [
        {
            type: 'button',
            text: 'Add Album',
            icon: 'b-fa b-fa-plus',
            onAction: 'up.addAlbum'
        },
        {
            type: 'button',
            text: 'Delete Selected',
            icon: 'b-fa b-fa-trash',
            onAction: 'up.deleteSelected'
        },
        '->', // Push remaining items to the right
        {
            type: 'button',
            text: 'Refresh',
            icon: 'b-fa b-fa-sync',
            onAction: 'up.refreshData'
        }
    ],

    // Column configuration
    columns: [
        {
            field: 'id',
            text: 'ID',
            width: 60,
            readOnly: true,
            type: 'number'
        },
        {
            field: 'title',
            text: 'Album Title',
            width: 200,
            editor: 'text',
            htmlEncode: false,
            renderer: ({ value }) => StringHelper.xss(value)
        },
        {
            field: 'artist',
            text: 'Artist',
            width: 160,
            editor: 'text',
            htmlEncode: false,
            renderer: ({ value }) => StringHelper.xss(value)
        },
        {
            field: 'genre',
            text: 'Genre',
            width: 120,
            editor: 'text',
            htmlEncode: false,
            renderer: ({ value }) => StringHelper.xss(value || '')
        },
        {
            field: 'year',
            text: 'Year',
            width: 80,
            type: 'number',
            editor: 'number'
        },
        {
            field: 'duration',
            text: 'Duration (min)',
            width: 110,
            type: 'number',
            editor: 'number'
        },
        {
            field: 'rating',
            text: 'Rating',
            width: 80,
            type: 'number',
            editor: 'number',
            renderer: ({ value }) => value ? `⭐ ${value}/10` : ''
        },
        {
            field: 'label',
            text: 'Record Label',
            width: 140,
            editor: 'text',
            htmlEncode: false,
            renderer: ({ value }) => StringHelper.xss(value || '')
        },
        {
            field: 'price',
            text: 'Price',
            width: 90,
            type: 'number',
            editor: 'number',
            renderer: ({ value }) => value ? `$${parseFloat(value).toFixed(2)}` : ''
        }
    ],

    // Event listeners
    listeners: {
        // Handle cell editing
        beforeCellEditStart: ({ field }) => {
            return field !== 'id'; // Don't allow editing ID field
        },
        
        // Handle cell edit completion
        cellEditComplete: 'up.updateAlbum'
    }
}; 