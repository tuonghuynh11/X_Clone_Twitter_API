export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name must be from 1 to 100 characters long',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_NOT_VALID: 'Email is not valid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password must be from 6 to 50 characters long',
  PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS_LONG_AND_CONTAIN_AT_LEAST_1_LOWERCASE_1_UPPERCASE_1_NUMBER_AND_1_SYMBOL:
    'Password must be at least 6 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password must be from 6 to 50 characters long',
  CONFIRM_PASSWORD_MUST_BE_EQUAL_TO_PASSWORD: 'Confirm password must be equal to password',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_SUCCESSFUL: 'Refresh token has been successfully',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout successful',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify successful',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successful',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token successful',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password successful',
  GET_MY_PROFILE_SUCCESS: 'Get my profile successful',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_A_STRING: 'BIO must be a string',
  BIO_LENGTH_MUST_BE_FROM_1_TO_200: 'BIO must be from 1 to 200 characters long',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_FROM_1_TO_200: 'Location must be from 1 to 200 characters long',
  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_FROM_1_TO_200: 'Website must be from 1 to 200 characters long',
  USERNAME_MUST_BE_A_STRING: 'User name must be a string',
  USERNAME_LENGTH_MUST_BE_FROM_1_TO_50: 'User name must be from 1 to 50 characters long',
  IMAGE_URL_MUST_BE_A_STRING: 'Image URL must be a string',
  IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400: 'Image URL must be from 1 to 400 characters long',
  UPDATE_MY_PROFILE_SUCCESS: 'Update profile successful',
  GET_PROFILE_SUCCESS: 'Get profile successful',
  FOLLOW_SUCCESS: 'Follow successful',
  INVALID_USER_ID: 'Invalid user id',
  FOLLOW_USER_NOT_VERIFIED_OR_BANED: 'Unable to follow user. The user account has not been verified or has been banned',
  FOLLOWED: 'Followed user',
  ALREADY_UNFOLLOWED: 'Already unfollowed user',
  UNFOLLOW_SUCCESS: 'Unfollow Successfully',
  USERNAME_ALREADY_EXISTS: 'User name already exists',
  USERNAME_INVALID:
    'User name must be 4-15 characters long and contain only letters, numbers, underscore, not only numbers',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  CHANGE_PASSWORDS_SUCCESS: 'Change passwords successful',
  GMAIL_NOT_VERIFIED: 'Email not verified',
  UPLOAD_SUCCESS: 'Upload successful',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status successful'
} as const

export const TWEETS_MESSAGES = {
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent id must be a valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'An array of user IDs must be an array of string',
  MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Media object must be an array of media object',
  CREATE_TWEET_SUCCESSFULLY: 'Create tweet successfully',
  INVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_ID_NOT_EMPTY: 'Tweet id must be not empty',
  TWEET_NOT_FOUND: 'The tweet is not found',
  TWEET_IS_NOT_PUBLIC: 'The tweet is not public',
  GET_TWEET_SUCCESSFULLY: 'Get tweet successfully',
  PAGE_SIZE_MAXIMUM_IS_100_AND_MINIMAL_IS_ONE: 'Page size maximum is 100 and minimal is 1',
  PAGE_IS_ALWAYS_GREATER_THAN_OR_EQUAL_TO_ONE: 'Page size is always greater than or equal to one',
  GET_NEW_FEED_SUCCESSFULLY: 'Get new feed successfully'
} as const
export const BOOKMARKS_MESSAGES = {
  BOOKMARKS_SUCCESSFULLY: 'Bookmarks successfully',
  TWEET_ID_MUST_BE_A_STRING: 'The tweet ID must be a string',
  TWEET_ID_NOT_EMPTY: 'The tweet ID must be not empty',
  INVALID_TWEET_ID: 'The tweet ID is invalid',
  TWEET_NOT_FOUND: 'The tweet is not found',
  UNBOOKMARKS_SUCCESSFULLY: 'Unbookmark successfully'
} as const
export const LIKES_MESSAGES = {
  LIKES_SUCCESSFULLY: 'LIKE Tweet successfully',
  TWEET_ID_MUST_BE_A_STRING: 'The tweet ID must be a string',
  TWEET_ID_NOT_EMPTY: 'The tweet ID must be not empty',
  INVALID_TWEET_ID: 'The tweet ID is invalid',
  TWEET_NOT_FOUND: 'The tweet is not found',
  UNLIKE_SUCCESSFULLY: 'Unlike successfully'
} as const
export const SEARCH_MESSAGES = {
  SEARCH_SUCCESSFULLY: 'Search successfully',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  MEDIA_TYPE_INVALID: 'Media type must be image or video',
  PEOPLE_FOLLOW_INVALID: 'People follow must be boolean'
} as const
export const CONVERSATIONS_MESSAGES = {
  GET_CONVERSATIONS_SUCCESSFULLY: 'Get conversions successfully'
} as const
