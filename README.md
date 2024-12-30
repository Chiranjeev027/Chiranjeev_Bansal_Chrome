# AI Chatbot Helper for Maang.in
This Chrome extension is designed to provide an interactive AI chatbot that assists users navigating the maang.in platform. The chatbot is specifically integrated to work on the /problems/ section of the site, offering real-time help based on problem data and user interactions.

## Features
- **AI Chatbot Integration**: The extension adds a button to the page that opens a chatbox, where users can interact with an AI-powered chatbot for assistance with coding problems.
- **Dynamic Content Injection**: Uses content.js and inject.js to inject necessary scripts and observe page changes. The extension dynamically loads content relevant to the current page and user.
- **Real-time Data Fetching**: Fetches user-specific problem data and profile information from the platform's API to provide personalized chatbot responses.
- **Customizable UI**: The chatbox is designed with a sleek UI that allows users to interact with the chatbot seamlessly. It includes a resizable chatbox, message history, and a send button for communication.
- **Color Palette**: The extension uses a custom color palette for styling, with primary, dark, and blue shades for a consistent theme across the UI.

## Installation
1. Download the repository or clone it using Git.
2. Open Chrome and go to the Extensions page (`chrome://extensions/`).
3. Enable "Developer mode" at the top right.
4. Click on "Load unpacked" and select the project folder.
5. The extension should now be installed and active in your browser.

## Usage
1. Navigate to a problem page on maang.in (e.g., `/problems/`).
2. The extension will automatically add an AI Helper button to the page.
3. Click the AI Helper button to open the chatbot interface.
4. Type your query in the input box and press Send to receive a response from the AI.

## How It Works
- **Content.js**: Observes changes on the page and injects the necessary scripts (inject.js) for dynamic interaction. It monitors user activity and ensures the chatbot is always available when required.
- **Inject.js**: Intercepts network requests (such as XHR and fetch) to capture data related to user problems and profile information, storing it locally for later use by the chatbot.
- **Popup.js**: Handles the popup interface where users can interact with the extension and configure settings like the API key for the AI.
- **Manifest.js**: Defines the extension's metadata, permissions, and scripts required for operation.

## API Integration
The extension uses the Gemini API to fetch AI responses. The API key is stored locally and used to generate content based on user queries. If the key is not set, the extension prompts the user to configure it via the popup interface.

## Troubleshooting
- If the extension isn't working as expected, ensure that the API key is correctly configured in the popup.
- Make sure you're on the correct page (`/problems/`) on maang.in for the AI Helper to appear.
- For any issues related to data fetching, check the browser's developer console for errors.

## Contributing
Feel free to fork the repository and contribute to the project. Open issues for any bugs or feature requests, and submit pull requests for improvements.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
