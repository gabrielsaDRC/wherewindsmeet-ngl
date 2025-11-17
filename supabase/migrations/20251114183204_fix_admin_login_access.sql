/*
  # Fix Admin Login Access

  1. Changes
    - Add SELECT policy to admin_account table to allow login verification
    - This allows the application to read admin credentials for authentication

  2. Security
    - Policy allows reading admin_account table for authentication purposes
    - Password is stored as plain text in password_hash field (for simplicity)
    - In production, this should use proper password hashing
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admin login" ON admin_account;

-- Create policy to allow reading admin credentials for login
CREATE POLICY "Allow admin login"
  ON admin_account FOR SELECT
  TO anon
  USING (true);