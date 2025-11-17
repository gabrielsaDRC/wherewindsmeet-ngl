/*
  # Update Player Fields

  1. Changes
    - Add `primary_weapon` column (replaces main_style)
    - Add `secondary_weapon` column (replaces qi_techniques)
    - Remove `server` column (no longer needed)
    - Remove `region` column (no longer needed)
    - Restrict professions to only Médico and Eremita
  
  2. Weapon Options
    Available weapons: Sword, Spear, Fan, Mo Blade, Dual Blades, Umbrella, Rope Dart
  
  3. Profession Options
    Only: Médico, Eremita
  
  4. Removed Fields
    - server: Not needed for guild registration
    - region: Not needed for guild registration
    - country: Removed from social profile
*/

-- Add new weapon columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'primary_weapon'
  ) THEN
    ALTER TABLE players ADD COLUMN primary_weapon text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'secondary_weapon'
  ) THEN
    ALTER TABLE players ADD COLUMN secondary_weapon text;
  END IF;
END $$;
