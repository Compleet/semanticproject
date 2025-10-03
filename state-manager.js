/**
 * PKM State Manager - Enterprise-grade state management
 * Inspired by Redux patterns and distributed systems architecture
 */

class PKMStateManager {
  constructor() {
    this.state = {
      // Core data
      notes: [],
      currentUser: null,
      currentVault: 'vault',

      // UI state
      activePanel: 'center',
      selectedNote: null,
      searchQuery: '',
      filters: {
        type: null,
        status: null,
        tags: []
      },

      // Application state
      isLoading: false,
      errors: [],
      notifications: [],

      // Performance state
      metrics: {
        lastLoadTime: null,
        searchPerformance: [],
        renderPerformance: []
      },

      // Settings
      preferences: {
        theme: 'dark',
        layout: 'tri-column',
        autoSave: true,
        notifications: true
      }
    };

    this.listeners = new Map();
    this.middleware = [];
    this.persistenceManager = new PKMPersistenceManager();

    this.initializeState();
  }

  async initializeState() {
    try {
      // Load persisted state
      const persistedState = await this.persistenceManager.loadState();
      if (persistedState) {
        this.state = { ...this.state, ...persistedState };
      }

      // Notify listeners of initial state
      this.notifyListeners('INIT', this.state);
    } catch (error) {
      console.error('Failed to initialize state:', error);
      this.dispatch('ERROR_OCCURRED', { error: error.message });
    }
  }

  // Redux-style dispatch system
  dispatch(action, payload = {}) {
    const prevState = { ...this.state };

    try {
      // Apply middleware
      for (const middleware of this.middleware) {
        const result = middleware(action, payload, this.state);
        if (result === false) return; // Middleware can prevent action
      }

      // Apply state changes
      this.state = this.reducer(this.state, { type: action, payload });

      // Persist critical state changes
      if (this.shouldPersist(action)) {
        this.persistenceManager.saveState(this.getPersistedState());
      }

      // Notify listeners
      this.notifyListeners(action, this.state, prevState);

    } catch (error) {
      console.error('State dispatch error:', error);
      this.state = prevState; // Rollback on error
      this.dispatch('ERROR_OCCURRED', { error: error.message });
    }
  }

  reducer(state, action) {
    switch (action.type) {
      case 'SET_NOTES':
        return { ...state, notes: action.payload };

      case 'ADD_NOTE':
        return {
          ...state,
          notes: [action.payload, ...state.notes]
        };

      case 'UPDATE_NOTE':
        return {
          ...state,
          notes: state.notes.map(note =>
            note.id === action.payload.id ? { ...note, ...action.payload } : note
          )
        };

      case 'DELETE_NOTE':
        return {
          ...state,
          notes: state.notes.filter(note => note.id !== action.payload.id)
        };

      case 'SET_CURRENT_USER':
        return { ...state, currentUser: action.payload };

      case 'SET_CURRENT_VAULT':
        return { ...state, currentVault: action.payload };

      case 'SET_SELECTED_NOTE':
        return { ...state, selectedNote: action.payload };

      case 'SET_SEARCH_QUERY':
        return { ...state, searchQuery: action.payload };

      case 'SET_FILTERS':
        return {
          ...state,
          filters: { ...state.filters, ...action.payload }
        };

      case 'SET_LOADING':
        return { ...state, isLoading: action.payload };

      case 'ADD_NOTIFICATION':
        return {
          ...state,
          notifications: [...state.notifications, {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...action.payload
          }]
        };

      case 'REMOVE_NOTIFICATION':
        return {
          ...state,
          notifications: state.notifications.filter(n => n.id !== action.payload.id)
        };

      case 'ERROR_OCCURRED':
        return {
          ...state,
          errors: [...state.errors, {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message: action.payload.error
          }]
        };

      case 'CLEAR_ERRORS':
        return { ...state, errors: [] };

      case 'UPDATE_PREFERENCES':
        return {
          ...state,
          preferences: { ...state.preferences, ...action.payload }
        };

      case 'RECORD_PERFORMANCE_METRIC':
        return {
          ...state,
          metrics: {
            ...state.metrics,
            [action.payload.type]: [
              ...state.metrics[action.payload.type] || [],
              action.payload.data
            ].slice(-50) // Keep only last 50 measurements
          }
        };

      default:
        return state;
    }
  }

  // Subscribe to state changes
  subscribe(listener, filter = null) {
    const id = Date.now() + Math.random();
    this.listeners.set(id, { listener, filter });

    // Return unsubscribe function
    return () => this.listeners.delete(id);
  }

  notifyListeners(action, newState, prevState = null) {
    this.listeners.forEach(({ listener, filter }) => {
      try {
        if (!filter || filter(action, newState, prevState)) {
          listener(action, newState, prevState);
        }
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  // Middleware system
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  // State selectors
  getState() {
    return { ...this.state };
  }

  getNotes() {
    return this.state.notes;
  }

  getFilteredNotes() {
    let notes = this.state.notes;

    // Apply search filter
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.toLowerCase();
      notes = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (this.state.filters.type) {
      notes = notes.filter(note => note.type === this.state.filters.type);
    }

    // Apply status filter
    if (this.state.filters.status) {
      notes = notes.filter(note => note.status === this.state.filters.status);
    }

    return notes;
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  getSelectedNote() {
    return this.state.selectedNote;
  }

  isLoading() {
    return this.state.isLoading;
  }

  getErrors() {
    return this.state.errors;
  }

  getNotifications() {
    return this.state.notifications;
  }

  // Utility methods
  shouldPersist(action) {
    const persistableActions = [
      'SET_CURRENT_USER',
      'SET_CURRENT_VAULT',
      'UPDATE_PREFERENCES',
      'ADD_NOTE',
      'UPDATE_NOTE',
      'DELETE_NOTE'
    ];

    return persistableActions.includes(action);
  }

  getPersistedState() {
    return {
      currentUser: this.state.currentUser,
      currentVault: this.state.currentVault,
      preferences: this.state.preferences,
      // Don't persist notes - they come from files
      // Don't persist UI state - should be fresh on load
    };
  }
}

/**
 * Persistence Manager - Handles state persistence to localStorage/IndexedDB
 */
class PKMPersistenceManager {
  constructor() {
    this.storageKey = 'pkm_state';
    this.isIndexedDBAvailable = 'indexedDB' in window;
  }

  async saveState(state) {
    try {
      if (this.isIndexedDBAvailable) {
        await this.saveToIndexedDB(state);
      } else {
        this.saveToLocalStorage(state);
      }
    } catch (error) {
      console.error('Failed to save state:', error);
      // Fallback to localStorage
      this.saveToLocalStorage(state);
    }
  }

  async loadState() {
    try {
      if (this.isIndexedDBAvailable) {
        const indexedDBState = await this.loadFromIndexedDB();
        if (indexedDBState !== null) {
          return indexedDBState;
        }
        // If IndexedDB returns null, try localStorage as fallback
        console.warn('IndexedDB returned null, falling back to localStorage');
        return this.loadFromLocalStorage();
      } else {
        return this.loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load state from IndexedDB:', error);
      // Always fallback to localStorage on any error
      try {
        return this.loadFromLocalStorage();
      } catch (localStorageError) {
        console.error('Failed to load state from localStorage as well:', localStorageError);
        return null;
      }
    }
  }

  saveToLocalStorage(state) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('localStorage save failed:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('localStorage load failed:', error);
      return null;
    }
  }

  async saveToIndexedDB(state) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PKMDatabase', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;

        // Verify object store exists before using it
        if (!db.objectStoreNames.contains('state')) {
          console.warn('Object store "state" does not exist, falling back to localStorage');
          resolve();
          return;
        }

        const transaction = db.transaction(['state'], 'readwrite');
        const store = transaction.objectStore('state');

        store.put({ id: 1, state, timestamp: Date.now() });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state', { keyPath: 'id' });
        }
      };
    });
  }

  async loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PKMDatabase', 1);

      request.onerror = () => {
        console.warn('IndexedDB failed, falling back to localStorage');
        resolve(null);
      };

      request.onsuccess = () => {
        const db = request.result;

        // Verify object store exists before using it
        if (!db.objectStoreNames.contains('state')) {
          console.warn('Object store "state" does not exist, returning null');
          resolve(null);
          return;
        }

        const transaction = db.transaction(['state'], 'readonly');
        const store = transaction.objectStore('state');
        const getRequest = store.get(1);

        getRequest.onsuccess = () => {
          const result = getRequest.result;
          resolve(result ? result.state : null);
        };

        getRequest.onerror = () => {
          console.warn('Failed to load from IndexedDB, falling back to localStorage');
          resolve(null);
        };
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state', { keyPath: 'id' });
        }
      };
    });
  }

  async resetIndexedDB() {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase('PKMDatabase');

      deleteRequest.onsuccess = () => {
        console.log('IndexedDB database deleted successfully');
        resolve();
      };

      deleteRequest.onerror = () => {
        console.warn('Failed to delete IndexedDB database');
        resolve(); // Don't reject, just continue
      };

      deleteRequest.onblocked = () => {
        console.warn('IndexedDB deletion blocked, continuing anyway');
        resolve();
      };
    });
  }
}

// Export for global use
window.PKMStateManager = PKMStateManager;
