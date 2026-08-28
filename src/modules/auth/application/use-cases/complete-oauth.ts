import {
  exchangeOAuthCode,
  loginWithToken,
} from '../../infrastructure/payload-auth-repository';

// Two steps now: the callback page only ever sees a short-lived one-time code,
// which is redeemed here for the session token (issue #229).
export async function completeOAuth(code: string) {
  const token = await exchangeOAuthCode(code);
  return loginWithToken(token);
}
