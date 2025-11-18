// Google Apps Script Proxy for Nabd Dz Engine
// Securely handles API calls to Kimi and Chat.z.ai
// Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)

/**
 * This function is the main entry point for our proxy.
 * It receives POST requests from the Nabd Dz Engine, forwards them
 * to the appropriate AI model, and returns the response.
 * @param {Object} e - The event object from Google Apps Script.
 * @returns {ContentService.TextOutput} The JSON response from the AI model or an error message.
 */
function doPost(e) {
  // --- IMPORTANT: SECURITY ---
  // Replace the placeholder text below with your actual API keys.
  // Never share these keys or commit them to a public repository.
  const API_KEY_KIMI = "YOUR_KIMI_API_KEY"; // <-- ضع مفتاح Kimi هنا
  const API_KEY_Z_AI = "YOUR_Z_AI_API_KEY"; // <-- ضع مفتاح Z.AI هنا

  try {
    // Parse the incoming request body from the Nabd Dz Engine
    const data = JSON.parse(e.postData.contents);
    const { model, prompt } = data;

    // Validate the input to ensure we have a model and a prompt
    if (!model || !prompt) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Model and prompt are required.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let apiUrl, apiKey;

    // Determine which AI model to call based on the 'model' parameter
    if (model === 'kimi') {
      // Replace with the actual Moonshot AI API endpoint
      apiUrl = 'https://api.moonshot.cn/v1/chat/completions';
      apiKey = API_KEY_KIMI;
    } else if (model === 'z_ai') {
      // Replace with the actual Chat.z.ai API endpoint
      apiUrl = 'https://api.chat.z.ai/v1/chat/completions'; // This is a placeholder URL
      apiKey = API_KEY_Z_AI;
    } else {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid model specified.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Set up the options for the UrlFetchApp.fetch call
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Bearer ' + apiKey
      },
      // The payload structure might differ based on the AI provider's API
      'payload': JSON.stringify({
        model: "moonshot-v1-8k", // Example model for Kimi
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    };

    // Make the API call to the chosen AI model
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseData = JSON.parse(response.getContentText());

    // Return the successful response from the AI model
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Proxy Error: ' + error.toString());
    
    // Return a generic error message to the client
    return ContentService.createTextOutput(JSON.stringify({ error: 'An internal error occurred in the proxy.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
