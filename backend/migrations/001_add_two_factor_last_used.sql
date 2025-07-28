-- Migration: Add two_factor_last_used column to users table
-- Date: 2025-07-28
-- Description: Adds a column to track the last time a 2FA token was used to prevent token reuse

-- Add the two_factor_last_used column
ALTER TABLE users 
ADD COLUMN two_factor_last_used TIMESTAMP;

-- Add index for better performance on 2FA queries
CREATE INDEX idx_users_two_factor_last_used ON users(two_factor_last_used);

-- Add comment for documentation
COMMENT ON COLUMN users.two_factor_last_used IS 'Timestamp of when the last 2FA token was used to prevent token reuse';
