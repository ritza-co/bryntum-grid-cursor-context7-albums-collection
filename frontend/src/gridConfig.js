export const gridConfig = {
    appendTo: 'app',
    
    // Store configuration with AjaxStore
    store: {
        createUrl: 'http://localhost:3001/api/albums',
        readUrl: 'http://localhost:3001/api/albums',
        updateUrl: 'http://localhost:3001/api/albums',
        deleteUrl: 'http://localhost:3001/api/albums',
        autoLoad: true,
        autoCommit: true,
        
        useRestfulMethods: true,
        httpMethods: {
            read: 'GET',
            create: 'POST',
            update: 'PATCH',
            delete: 'DELETE'
        }
    },
    
    // Grid configuration
    autoHeight: false,
    flex: 1,
    
    // Enable editing and selection
    readOnly: false,
    multiSelect: true,
    
    // Toolbar with CRUD buttons and genre filter
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
        
        // Genre filter buttons
        {
            type: 'container',
            cls: 'genre-filter-container',
            html: '<label class="genre-filter-label">Filter by genre:</label>',
            style: 'margin-right: 10px; display: flex; align-items: center;'
        },
        {
            type: 'buttongroup',
            cls: 'genre-filter-buttons',
            ref: 'genreFilterButtons',
            style: 'margin-right: 20px;',
            items: [
                {
                    type: 'button',
                    text: 'All',
                    cls: 'genre-filter-pill active',
                    ref: 'allGenresBtn',
                    pressed: true,
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Pop',
                    cls: 'genre-filter-pill',
                    ref: 'popBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Rock',
                    cls: 'genre-filter-pill',
                    ref: 'rockBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Progressive Rock',
                    cls: 'genre-filter-pill',
                    ref: 'progressiveRockBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Hard Rock',
                    cls: 'genre-filter-pill',
                    ref: 'hardRockBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Alternative Rock',
                    cls: 'genre-filter-pill',
                    ref: 'alternativeRockBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Psychedelic Rock',
                    cls: 'genre-filter-pill',
                    ref: 'psychedelicRockBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Grunge',
                    cls: 'genre-filter-pill',
                    ref: 'grungeBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Jazz',
                    cls: 'genre-filter-pill',
                    ref: 'jazzBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                },
                {
                    type: 'button',
                    text: 'Soul',
                    cls: 'genre-filter-pill',
                    ref: 'soulBtn',
                    toggleable: true,
                    onAction: 'up.onGenreFilter'
                }
            ]
        },
        
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
            editor: 'text'
        },
        {
            field: 'artist',
            text: 'Artist',
            width: 160,
            editor: 'text'
        },
        {
            field: 'genre',
            text: 'Genre',
            width: 120,
            editor: 'text'
        },
        {
            field: 'year',
            text: 'Year',
            width: 80,
            type: 'number',
            editor: 'number',
            format: {
                template: '0',
            }
        },
        {
            field: 'duration',
            text: 'Duration (min)',
            width: 130,
            type: 'number',
            editor: 'number'
        },
        {
            field: 'rating',
            text: 'Rating',
            width: 100,
            type: 'number',
            editor: 'number',
            renderer: ({ value }) => value ? `⭐ ${value}/10` : ''
        },
        {
            field: 'label',
            text: 'Record Label',
            width: 140,
            editor: 'text'
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