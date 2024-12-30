let lastPageVisited ="";

// Global Map to store data for each user ID from '/problems/user/{id}'
let userProblemDataMap = new Map();

// Global variable to store data from '/users/profile/private'
let userProfileData = null;

//3
// Initialize the observer to start observing DOM changes
observePageChanges(); // Start observing DOM changes
handleContentChange();
addInjectScript();  // so that when are we going on different page it we still inject the files

// Define a color palette as constants
const COLORS = {
    PRIMARY: "#F7A478",  // Main primary color
    DARK: "#0A0902",     // Dark theme color
    NAVY: "#151D26",     // Deep navy color
    BLUE: "#1F3049",     // Blue shade
    LIGHT_BLUE: "#435773", // Lighter blue shade
    STEEL_BLUE: "#2B384E" // Steel blue shade
};

// Example usage in your code
console.log("Primary color is:", COLORS.PRIMARY);
console.log("Dark theme color is:", COLORS.DARK);



function addBookmarkButton() {
    if (document.getElementById("ai-helper-button")) {
        return; // Button already added
    }
const codingDescContainer = document.getElementsByClassName("py-4 px-3 coding_desc_container__gdB9M")[0];

    if (codingDescContainer) {
    const aiButton = document.createElement("button");

    aiButton.id = "ai-helper-button";
    aiButton.innerText = "AI Helper";
    aiButton.style.padding = "10px 20px";
    aiButton.style.fontSize = "14px";
    aiButton.style.cursor = "pointer";
    aiButton.style.marginTop = "10px";
    aiButton.style.backgroundColor = "#007BFF";
    aiButton.style.color = "white";
    aiButton.style.border = "none";
    aiButton.style.borderRadius = "5px";

    aiButton.addEventListener("click", () => {
        // alert("AI Helper clicked!"); // Replace with your desired functionality
        toggleChatbox(); // Toggle the chatbox visibility
    });
  

    codingDescContainer.insertAdjacentElement("beforeend",aiButton);
    console.log("AI Helper button added successfully!");
    } else {
        console.log("Target container not found! Waiting for it to load...");
    }

}
// async function getAPIKey() {
//     return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage({ action: "getAPIKey" }, (response) => {
//             if (response && response.apiKey) {
//                 resolve(response.apiKey);
//             } else {
//                 reject("API Key not found");
//             }
//         });
//     });
// }
async function getAPIKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("apiKey", (result) => {
            if (result.apiKey) {
                resolve(result.apiKey);
            } else {
                reject("API key not found. Please set it in the extension popup.");
            }
        });
    });
}

// API

//getAIRespnose
    async function getAIResponse(userMessage) {

        const GEMINI_API_KEY = await getAPIKey();
        const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

        const payload = {
            contents: [
                {
                    parts: [
                        { text: userMessage }
                    ]
                }
            ]
        };

        try {
            console.log("inside try"); 
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),  
            });

            if (!response.ok) {
                throw new Error("Failed to fetch AI response with status: " + response.status);
            
            }

            const data = await response.json();
            console.log('API Response:', data); // Log the response to see what you get
            
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
            
            return aiResponse;
        } catch(error) {
            console.error("Error fetching AI response:", error);
            return "Oops! Something went wrong. Please try again.";
        }
    }


    // CHATBOT 4;-

    function toggleChatbox() {
        let chatbox = document.getElementById("ai-chatbox");

        if (!chatbox) {
            // Create the chatbox container
            chatbox = document.createElement("div");
            chatbox.id = "ai-chatbox";
            chatbox.style.marginTop = "10px";
            chatbox.style.padding = "10px";
            chatbox.style.border = `1px solid ${COLORS.STEEL_BLUE}`;
            chatbox.style.borderRadius = "10px";
            chatbox.style.boxShadow = `0 4px 6px ${COLORS.DARK}`;
            chatbox.style.backgroundColor = COLORS.NAVY;
            chatbox.style.width = "100%"; // Make it 100% of its container width
            chatbox.style.height = "auto"; // Adjust height based on content
            chatbox.style.resize = "both"; // Allow both horizontal and vertical resizing
            chatbox.style.overflow = "auto"; // Handle overflow during resize
            chatbox.style.fontFamily = "'Arial', sans-serif";
            chatbox.style.display = "none"; // Initially hidden
            chatbox.style.minWidth = "200px"; // Minimum width
            chatbox.style.minHeight = "150px"; // Minimum height

            // Chatbox header
            const header = document.createElement("div");
            header.style.backgroundColor = COLORS.PRIMARY;
            header.style.color = COLORS.DARK;
            header.style.padding = "10px";
            header.style.fontSize = "16px";
            header.style.fontWeight = "bold";
            header.style.borderTopLeftRadius = "10px";
            header.style.borderTopRightRadius = "10px";
            header.style.display = "flex";
            header.style.justifyContent = "space-between";
            header.style.alignItems = "center";

            const headerText = document.createElement("span");
            headerText.innerText = "AI Chatbot";

            // Close button
            const closeButton = document.createElement("button");
            closeButton.innerText = "X";
            closeButton.style.backgroundColor = "transparent";
            closeButton.style.border = "none";
            closeButton.style.color = COLORS.DARK;
            closeButton.style.fontSize = "14px";
            closeButton.style.cursor = "pointer";
            closeButton.addEventListener("click", () => {
                chatbox.style.display = "none";
            });

            header.appendChild(headerText);
            header.appendChild(closeButton);

            // Chat messages container
            const messagesContainer = document.createElement("div");
            messagesContainer.id = "chat-messages";
            messagesContainer.style.padding = "10px";
            messagesContainer.style.overflowY = "auto";
            messagesContainer.style.backgroundColor = COLORS.LIGHT_BLUE;
            messagesContainer.style.flexGrow = "1"; // Allow messages container to grow
            messagesContainer.style.minHeight = "100px"; // Minimum height for messages container

            // Input container
            const inputContainer = document.createElement("div");
            inputContainer.style.display = "flex";
            inputContainer.style.padding = "10px";
            inputContainer.style.borderTop = `1px solid ${COLORS.STEEL_BLUE}`;
            inputContainer.style.backgroundColor = COLORS.BLUE;

            const inputBox = document.createElement("input");
            inputBox.type = "text";
            inputBox.placeholder = "Type your message...";
            inputBox.style.flex = "1"; // Take up remaining space
            inputBox.style.padding = "10px";
            inputBox.style.border = `1px solid ${COLORS.LIGHT_BLUE}`;
            inputBox.style.borderRadius = "5px";
            inputBox.style.marginRight = "10px";

            const sendButton = document.createElement("button");
            sendButton.innerText = "Send";
            sendButton.style.backgroundColor = COLORS.PRIMARY;
            sendButton.style.color = COLORS.DARK;
            sendButton.style.border = "none";
            sendButton.style.padding = "10px 15px";
            sendButton.style.borderRadius = "5px";
            sendButton.style.cursor = "pointer";

            
            sendButton.addEventListener("click", async () => {
                const message = inputBox.value.trim();
                console.log("before message");
            
                if (message) {
                    console.log("after message");
            
                    // Create a container to hold both the user input and the highlighted message
                    const messageContainer = document.createElement("div");
                    messageContainer.style.display = "flex"; // Flexbox to align the input and highlighted message
                    messageContainer.style.alignItems = "flex-end"; // Align both elements to the bottom of the container
            
                    // Display the user's message in the chatbox (highlighted on the right)
                    const userMessageDiv = document.createElement("div");
                    userMessageDiv.style.backgroundColor = COLORS.STEEL_BLUE; // Reverted to previous highlight color for user input
                    userMessageDiv.style.color = "white"; // Dark text for contrast
                    userMessageDiv.style.padding = "10px";
                    userMessageDiv.style.margin = "5px 0";
                    userMessageDiv.style.borderRadius = "10px";
                    userMessageDiv.style.boxShadow = `0 2px 4px ${COLORS.DARK}`; // Subtle shadow for highlighting
                    userMessageDiv.style.textAlign = "right"; // Align text to the right (for user input)
                    userMessageDiv.style.maxWidth = "70%"; // Optional: Limit the width of the message
                    userMessageDiv.style.marginLeft = "auto"; // Align message to the right
                    userMessageDiv.innerText = message;
            
                    // Add the user message to the container
                    messageContainer.appendChild(userMessageDiv);
            
                    // Add the message container to the messages container
                    messagesContainer.appendChild(messageContainer);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
            
                    inputBox.value = ""; // Clear the input box
            
                    // Fetch and display AI response
                    console.log("before response");
                    try {
                        const aiResponse = await getAIResponse(message); // Pass the message string
                        console.log(aiResponse);
            
                        // Create a container for the AI response
                        const botMessageDiv = document.createElement("div");
                        botMessageDiv.style.backgroundColor = COLORS.NAVY; // Highlighted background for AI response
                        botMessageDiv.style.color = "white"; // Dark text for contrast
                        botMessageDiv.style.padding = "10px";
                        botMessageDiv.style.margin = "5px 0";
                        botMessageDiv.style.borderRadius = "10px";
                        botMessageDiv.style.boxShadow = `0 2px 4px ${COLORS.DARK}`; // Subtle shadow for highlighting
                        botMessageDiv.style.textAlign = "left"; // Align bot response to the left
                        botMessageDiv.style.maxWidth = "70%"; // Optional: Limit the width of the message
                        botMessageDiv.style.marginRight = "auto"; // Align message to the left
                        botMessageDiv.innerText = aiResponse;
            
                        // Add the bot message to the container
                        const botMessageContainer = document.createElement("div");
                        botMessageContainer.style.display = "flex";
                        botMessageContainer.style.alignItems = "flex-end"; // Align bot message to the bottom of the container
                        botMessageContainer.appendChild(botMessageDiv);
            
                        // Add the AI response container to the messages container
                        messagesContainer.appendChild(botMessageContainer);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
                    } catch (error) {
                        console.error("Error fetching AI response:", error);
            
                        const errorMessageDiv = document.createElement("div");
                        errorMessageDiv.style.backgroundColor = "red";
                        errorMessageDiv.style.color = "white"; // High contrast for error messages
                        errorMessageDiv.style.padding = "10px";
                        errorMessageDiv.style.margin = "5px 0";
                        errorMessageDiv.style.borderRadius = "10px";
                        errorMessageDiv.style.textAlign = "left"; // Align error message to the left
                        errorMessageDiv.style.maxWidth = "70%"; // Optional: Limit the width of the message
                        errorMessageDiv.style.marginLeft = "10px"; // Add some margin to the left
                        errorMessageDiv.innerText = "Oops! Something went wrong. Please try again.";
            
                        messagesContainer.appendChild(errorMessageDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
                    }
                }
            });
            
            
            
            

            inputContainer.appendChild(inputBox);
            inputContainer.appendChild(sendButton);

            chatbox.appendChild(header);
            chatbox.appendChild(messagesContainer);
            chatbox.appendChild(inputContainer);

            // Insert chatbox under the AI Helper button
            const aiButton = document.getElementById("ai-helper-button");
            aiButton.insertAdjacentElement("afterend", chatbox);
        }

        // Toggle visibility
        chatbox.style.display = chatbox.style.display === "none" ? "block" : "none";
    }



//2
// Function to observe DOM changes and add button when appropriate
function observePageChanges() {
    console.log("MutationObserver is active!");

    const targetNode = document.body; // Observe the entire body
    const config = { childList: true, subtree: true }; // Watch for added/removed nodes

    const observer = new MutationObserver(() => {
        // Check if we are on the /problem/* route
        // if (handleContentChange()) {
            
        //     console.log("innnnnn");
        //     addBookmarkButton(); // Add the button if we are on the correct route
        // }
        handleContentChange();
    });
    

    observer.observe(targetNode, config); // Start observing the DOM
    
}





function handleContentChange(){
    if(isPageChange()) handlePageChange();
}


function isPageChange(){
    const currChange = window.location.pathname;
    if(currChange ===  lastPageVisited) return false;

    lastPageVisited =currChange;
    return true;
}

function handlePageChange(){
    if(onTargetPage()){
        cleanUpPage();
        addInjectScript();
        console.log("insert");
        addBookmarkButton();
    }
} 

// function onTargetPage(){
//     return window.location.pathname.startsWith('/problems/');
// }

function onTargetPage(){
    const  pathname = window.location.pathname;
    return pathname.startsWith('/problems/') && pathname.length > '/problems/'.length;
}

function cleanUpPage(){
    const  existingButton = document.getElementById("ai-helper-button");
    if(existingButton) existingButton.remove();

    const existingChatBot = document.getElementById("ai-chatbox");
    if(existingChatBot) existingChatBot.remove();
}

// Current problem Id from URL
function getCurrentProblemId() {
    const match = window.location.pathname.match(/-(\d+)$/); // Matches a dash followed by digits at the end of the path
    return match ? match[1] : "Problem number not found";
}

// id = getCurrentProblemId()
function getproblemDataById(id){
    if(id && userProblemDataMap.has(id)){
        return userProblemDataMap.has(id);
    }
    console.log(`No data found for problem ID ${id}`);
    return null;
}

function getLocalStroageValueById(id){
    const key = `course_${userProfileData}_${id}_Java`;
    // const key = `course_28824_${id}_Java`;

    const value =localStorage.getItem(key);

    if(value !== null){
        console.log(`value for key "${key}":`, value);
    } else {
        console.log(`key "${key}" not found in localStorage`);
    }

    return value;
}

function addInjectScript(){
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js'); // Load from web_accessible_resources
    // script.onload = () => script.remove();
    document.documentElement.appendChild(script);
    document.head.appendChild(script);

}


// INJECT THE INJECT.JS


// Listen for custom events dispatched by inject.js
window.addEventListener('InterceptedRequest', (event) => {
    console.log('Intercepted data from inject.js:', event.detail);

    const { method, url, response } = event.detail;

    // Perform filtration for XHR requests
    if (method === 'xhr') {
        // Check if the URL matches the target endpoint for user problem data
        if (url.includes('https://api2.maang.in/problems/user/')) {
            // Extract the user ID (e.g., 1145 from the URL)
            const userIdMatch = url.match(/\/user\/(\d+)/);
            if (userIdMatch && userIdMatch[1]) {
                const userId = userIdMatch[1];
                console.log('Extracted user ID from URL:', userId);

                // Store the response data in the Map with userId as the key
                try {
                    const responseData = JSON.parse(response);
                    userProblemDataMap.set(userId, responseData);
                    console.log(`Stored problem data for user ${userId}:`, responseData);
                } catch (error) {
                    console.error('Error parsing XHR response for user problem data:', error);
                }
            }
        }

        // Check if the URL matches the users/profile/private endpoint
        if (url === 'https://api2.maang.in/users/profile/private') {
            try {
                const responseData = JSON.parse(response);
                const userId = responseData.data ? responseData.data.id : null;
                if (userId) {
                    console.log('Extracted user ID from profile response:', userId);

                    // Store the user profile data in the global variable
                    userProfileData = responseData.data;
                    console.log('Stored user profile data:', userProfileData);
                }
            } catch (error) {
                console.error('Error parsing XHR response for user profile data:', error);
            }
        }
    }

    // Access stored data later
    console.log('All stored user problem data:', Array.from(userProblemDataMap.entries()));
    console.log('Stored user profile data:', userProfileData);
});


function buildIntitialPrompt(userMessage){
    const problemId = getCurrentProblemId();

    const problemData = getproblemDataById(problemId);
    const currrentCode =getLocalStroageValueById(problemId);
    
    return ```
    Following is a message by user,  that is trying  to uderstand  the following  problem.
    
    ```
}







