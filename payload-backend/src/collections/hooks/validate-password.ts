import { APIError, TypedUser, type CollectionBeforeValidateHook } from 'payload'

export const passwordValidation: CollectionBeforeValidateHook<TypedUser> = async ({data}) => {
    // Ignore if no data is provided
    if (!data) return;
    
    if (!data.password) {
        throw new APIError('Password is required', 422);
    }

    if (data.password.length < 8) {
        throw new APIError('Password must be at least 8 characters long', 422);
    }
    if (data.password.length > 64) {
        throw new APIError('Password must be less than 64 characters long', 422);
    }
    return data;
}