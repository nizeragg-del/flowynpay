"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowynAuth = void 0;
class FlowynAuth {
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.redirectUri = options.redirectUri;
        // Default to production API
        this.apiUrl = 'https://api.flowyn.com';
        if (options.environment === 'sandbox') {
            this.apiUrl = 'https://sandbox.api.flowyn.com';
        }
        else if (options.environment === 'local') {
            this.apiUrl = 'http://localhost:3000';
        }
    }
    /**
     * Generates the Authorization URL to redirect the user to.
     */
    getAuthorizationUrl() {
        const authUrl = this.apiUrl.replace('api.', '') + '/oauth/authorize';
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
        });
        return `${authUrl}?${params.toString()}`;
    }
    /**
     * Exchanges an authorization code for an access token.
     */
    async getAccessToken(code) {
        const response = await fetch(`${this.apiUrl}/api/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
                redirect_uri: this.redirectUri,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Flowyn OAuth Token Error: ${response.status} - ${errorText}`);
        }
        return await response.json();
    }
    /**
     * Retrieves the user's information and active plans using their access token.
     */
    async getUserInfo(accessToken) {
        const response = await fetch(`${this.apiUrl}/api/oauth/userinfo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Flowyn OAuth UserInfo Error: ${response.status} - ${errorText}`);
        }
        return await response.json();
    }
    /**
     * Convenience method to exchange a code and fetch the user info in one step.
     */
    async authenticate(code) {
        const tokens = await this.getAccessToken(code);
        const user = await this.getUserInfo(tokens.access_token);
        return { tokens, user };
    }
}
exports.FlowynAuth = FlowynAuth;
