// src/Utils/api.js
export const apiCall = async (endpoint, method = 'GET', params = null, body = null, token = null, isFormData = false) => {
  const headers = {
    'Accept': 'application/json',
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['ApiKey'] = token;
  }

  // Construir la URL con los parámetros de consulta solo si existen
  let url = new URL(`https://youshareapp-04149a34a24e.herokuapp.com${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });
  }

  const options = {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : null),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    // Check if there is a response body before trying to parse it as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // If no JSON content, return null or an appropriate default value
    return null;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
