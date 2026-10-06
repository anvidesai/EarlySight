/**
 * EarlySight — Frontend API Client Service
 *
 * Centralized, robust HTTP communication client connecting the EarlySight frontend
 * to the FastAPI backend API endpoints.
 *
 * Default local development endpoint: http://127.0.0.1:8000
 * Configurable via VITE_API_BASE_URL environment variable.
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://127.0.0.1:8000';

/**
 * Standard HTTP request wrapper with robust error handling and timeout.
 * Returns { ok: boolean, data?: any, status?: number, error?: string }
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return { ok: true, status: 204, data: null };
    }

    let responseData = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMsg =
        (responseData && typeof responseData === 'object' && responseData.detail) ||
        (typeof responseData === 'string' && responseData) ||
        `Request failed with status ${response.status}`;

      return {
        ok: false,
        status: response.status,
        error: errorMsg,
        data: responseData,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: responseData,
    };
  } catch (err) {
    // Graceful handling of network disconnects or offline server
    return {
      ok: false,
      status: 0,
      error: `Network error: unable to connect to EarlySight backend at ${API_BASE_URL} (${err.message})`,
      data: null,
    };
  }
}

/**
 * EarlySight Operational API Methods
 */
export const EarlySightApi = {
  baseUrl: API_BASE_URL,

  /**
   * Health Check: GET /api/health
   */
  async checkHealth() {
    return apiRequest('/api/health');
  },

  /**
   * Root API Status: GET /
   */
  async checkRoot() {
    return apiRequest('/');
  },

  /**
   * List Signals: GET /api/signals?skip=0&limit=50
   */
  async getSignals({ skip = 0, limit = 50 } = {}) {
    const query = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiRequest(`/api/signals?${query.toString()}`);
  },

  /**
   * Get Signal by ID: GET /api/signals/{signal_id}
   */
  async getSignalById(signalId) {
    return apiRequest(`/api/signals/${signalId}`);
  },

  /**
   * Create Signal: POST /api/signals
   */
  async createSignal(payload) {
    return apiRequest('/api/signals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Partially Update Signal: PATCH /api/signals/{signal_id}
   */
  async updateSignal(signalId, payload) {
    return apiRequest(`/api/signals/${signalId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete Signal: DELETE /api/signals/{signal_id}
   */
  async deleteSignal(signalId) {
    return apiRequest(`/api/signals/${signalId}`, {
      method: 'DELETE',
    });
  },
};

export default EarlySightApi;
