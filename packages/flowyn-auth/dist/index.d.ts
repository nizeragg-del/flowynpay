export interface FlowynAuthOptions {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    environment?: 'production' | 'sandbox' | 'local';
}
export interface FlowynTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}
export interface FlowynUser {
    id: string;
    email: string;
    name: string;
    active_plans: string[];
}
export declare class FlowynAuth {
    private clientId;
    private clientSecret;
    private redirectUri;
    private apiUrl;
    constructor(options: FlowynAuthOptions);
    /**
     * Generates the Authorization URL to redirect the user to.
     */
    getAuthorizationUrl(): string;
    /**
     * Exchanges an authorization code for an access token.
     */
    getAccessToken(code: string): Promise<FlowynTokenResponse>;
    /**
     * Retrieves the user's information and active plans using their access token.
     */
    getUserInfo(accessToken: string): Promise<FlowynUser>;
    /**
     * Convenience method to exchange a code and fetch the user info in one step.
     */
    authenticate(code: string): Promise<{
        tokens: FlowynTokenResponse;
        user: FlowynUser;
    }>;
}
