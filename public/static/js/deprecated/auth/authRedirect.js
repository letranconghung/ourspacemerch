// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";
/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/acquire-token.md
 */
myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.error(error);
    });

function selectAccount () {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    console.log("selectAccount called");
    const currentAccounts = myMSALObj.getAllAccounts();

    if (currentAccounts.length === 0) {
        console.log("currentAccs = 0");
        authUI(false);
        return;
    } else if (currentAccounts.length > 1) {
        console.log("currentAccs > 1");
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        console.log("currentAccs = 1");
        console.log(currentAccounts[0]);
        username = currentAccounts[0].username;
        // showWelcomeMessage(currentAccounts[0]);
        handleSignInData(currentAccounts[0]);
        authUI(true);
    }
}

function handleResponse(response) {
    console.log("handleResponse called");
    if (response !== null) {
        username = response.account.username;
        console.log("not null response. an account is logged in");
        handleSignInData(response.account);
        authUI(true);
    } else {
        console.log("null response");
        selectAccount();
    }
}

function signIn() {
    console.log("signIn called");
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
    console.log("signOut called");
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username),
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
    };

    myMSALObj.logoutRedirect(logoutRequest);
}

function getTokenRedirect(request) {
    console.log("getTokenRedirect called");
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    console.log("request:", request);
    request.account = myMSALObj.getAccountByUsername(username);
    console.log("request:", request);
    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.warn(error);   
            }
        });
}

function seeProfile() {
    console.log("seeProfile called");
    getTokenRedirect(loginRequest)
        .then(response => {
            callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, handleGraphData);
        }).catch(error => {
            console.error(error);
        });
}