/**
 * 1. After login: server will create a jwt token
 * 2. store it in client side (localStorage,httponly cookies,in memory)
 * 3. For asking sensitive data: send a request with jwt token in the header
 * 4. server will verify the token. If token is valid, then will provide the data.
 */

/**
 *  Access Token and Refresh Token
 */