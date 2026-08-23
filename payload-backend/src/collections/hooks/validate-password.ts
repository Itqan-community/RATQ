import { APIError, TypedUser, type CollectionBeforeValidateHook } from 'payload'

export const passwordValidation: CollectionBeforeValidateHook<TypedUser> = async ({data}) => {
    // Ignore if no data is provided
    if (!data) return;
    
    if (data.password === undefined || data.password === null) {
        return data; // profile update, no password change
    }

    if (typeof data.password !== 'string' || data.password.length < 8 || data.password.length > 64) {
        throw new APIError("Password must be between 8 and 64 characters long", 422);
    }
    return data;
}