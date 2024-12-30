document.getElementById("saveKey").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    if (apiKey) {
        chrome.storage.local.set({ apiKey }, () => {
            document.getElementById("status").textContent = "API Key saved successfully!";
            setTimeout(() => {
                document.getElementById("status").textContent = "";
            }, 3000);
        });
    } else {
        document.getElementById("status").textContent = "Please enter a valid API key.";
        setTimeout(() => {
            document.getElementById("status").textContent = "";
        }, 3000);
    }
});
