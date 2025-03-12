// worksheetService.js - place in Frontend/static/js/

/**
 * Worksheet Service
 * Handles all worksheet related operations
 */
class WorksheetService {
    constructor() {
        this.API_URL = '/api/worksheets';
    }
    
    /**
     * Get authorization headers
     * @returns {Object} - Headers object with authorization
     */
    _getAuthHeaders() {
        const token = authService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
    
    /**
     * Get all worksheets for the current user
     * @returns {Promise} - Promise with worksheets array
     */
    async getAllWorksheets() {
        try {
            const response = await fetch(this.API_URL, {
                method: 'GET',
                headers: this._getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch worksheets');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching worksheets:', error);
            throw error;
        }
    }
    
    /**
     * Get worksheet by ID
     * @param {number} id - Worksheet ID
     * @returns {Promise} - Promise with worksheet object
     */
    async getWorksheetById(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'GET',
                headers: this._getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch worksheet');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching worksheet ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Create a new worksheet
     * @param {Object} worksheet - Worksheet data
     * @returns {Promise} - Promise with response
     */
    async createWorksheet(worksheet) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: this._getAuthHeaders(),
                body: JSON.stringify(worksheet)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create worksheet');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating worksheet:', error);
            throw error;
        }
    }
    
    /**
     * Update an existing worksheet
     * @param {number} id - Worksheet ID
     * @param {Object} worksheet - Updated worksheet data
     * @returns {Promise} - Promise with response
     */
    async updateWorksheet(id, worksheet) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'PUT',
                headers: this._getAuthHeaders(),
                body: JSON.stringify(worksheet)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update worksheet');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error updating worksheet ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Delete a worksheet
     * @param {number} id - Worksheet ID
     * @returns {Promise} - Promise with response
     */
    async deleteWorksheet(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE',
                headers: this._getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete worksheet');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error deleting worksheet ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Filter worksheets by question type
     * @param {string} questionType - Type of questions
     * @returns {Promise} - Promise with filtered worksheets array
     */
    async filterWorksheets(questionType) {
        try {
            const response = await fetch(`${this.API_URL}/filter?questionType=${encodeURIComponent(questionType)}`, {
                method: 'GET',
                headers: this._getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to filter worksheets');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error filtering worksheets:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const worksheetService = new WorksheetService();
