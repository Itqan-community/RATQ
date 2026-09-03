import {
  exchangeOAuthCode,
  fetchUserDetails,
} from '../../infrastructure/payload-auth-repository';

// Two steps now: the callback page only ever sees a short-lived one-time code,
// which is redeemed here for the session token (issue #229).
export async function completeOAuth(code: string) {
  await exchangeOAuthCode(code);
  return fetchUserDetails();
}
