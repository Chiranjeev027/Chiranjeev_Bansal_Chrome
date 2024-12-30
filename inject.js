(function () {
    // // Intercept fetch requests
    // const originalFetch = window.fetch;
    // window.fetch = async function (...args) {
    //     try {
    //         console.log('Intercepted fetch request:', args[0]);

    //         // Call the original fetch function
    //         const response = await originalFetch.apply(this, args);

    //         // Clone the response to read it without affecting the original response
    //         const clonedResponse = response.clone();

    //         clonedResponse.text().then((text) => {
    //             console.log('Intercepted fetch response:', {
    //                 url: args[0],
    //                 response: text,
    //             });

    //             // Dispatch a custom event with the response data
    //             const event = new CustomEvent('InterceptedRequest', {
    //                 detail: {
    //                     method: 'fetch',
    //                     url: args[0],
    //                     response: text,
    //                 },
    //             });
    //             window.dispatchEvent(event);
    //         });

    //         return response;
    //     } catch (error) {
    //         console.error('Error in fetch interception:', error);
    //         throw error;
    //     }
    // };

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._interceptedUrl = url; // Save the request URL
        this._interceptedMethod = method; // Save the request method
        console.log('Intercepted XHR request:', { method, url });

        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener('load', () => {
            console.log('Intercepted XHR response:', {
                method: this._interceptedMethod,
                url: this._interceptedUrl,
                response: this.responseText,
            });

            // Dispatch a custom event with the response data
            const event = new CustomEvent('InterceptedRequest', {
                detail: {
                    method: 'xhr',
                    url: this._interceptedUrl,
                    response: this.responseText,
                },
            });
            window.dispatchEvent(event);
        });  

        return originalSend.apply(this, [body]);
    };

    console.log('Inject.js: Generalized interceptors loaded successfully!');
})();
