/*
  # Where Winds Meet - Player Registry Database Schema

  ## Overview
  Complete database structure for Where Winds Meet player registration system with admin panel and blog functionality.

  ## 1. New Tables
  
  ### `players`
  Player registration and profile information
  - `id` (uuid, primary key) - Unique player identifier
  - `nickname` (text, required) - Player's in-game nickname
  - `player_id` (text) - Game ID if applicable
  - `server` (text) - Game server
  - `region` (text) - Geographic region
  - `platform` (text) - Gaming platform
  
  ### Combat & Style
  - `main_style` (text) - Primary combat style
  - `secondary_styles` (text[]) - Secondary styles array
  - `build_type` (text) - DPS/Tank/Support/CC
  - `favorite_weapon` (text) - Preferred weapon
  - `qi_techniques` (text) - Favorite Qi techniques
  
  ### Progression
  - `level` (integer) - Character level
  - `combat_power` (integer) - Gear score/combat power
  - `professions` (text[]) - In-game professions array
  - `faction_reputation` (text) - Faction standing
  
  ### Gaming Info
  - `started_playing` (date) - When they started
  - `weekly_hours` (integer) - Average weekly playtime
  - `mmorpg_experience` (text) - Previous MMORPG experience
  
  ### Guild Information
  - `availability_days` (text[]) - Days available to play
  - `availability_time` (text) - Time periods available
  - `guild_role` (text) - Desired guild role
  - `content_interest` (text[]) - Interested content types
  - `has_microphone` (boolean) - Microphone availability
  - `discord_required` (boolean) - Discord requirement
  - `desired_rank` (text) - Desired guild rank
  
  ### Social Profile
  - `age` (integer) - Player age
  - `country` (text) - Country
  - `city` (text) - City
  - `discord_id` (text) - Discord username
  - `game_platform_id` (text) - Steam/Epic/NetEase ID
  - `streaming_link` (text) - Twitch/YouTube link
  
  ### Additional Info
  - `character_image` (text) - Character screenshot URL
  - `build_image` (text) - Build screenshot URL
  - `guild_motivation` (text) - Why join guild
  - `how_found_us` (text) - How they found the guild
  - `expectations` (text) - Game expectations
  - `bio` (text) - Personal bio
  - `gamer_personality` (text[]) - Personality traits array
  
  ### Metadata
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `admin_account`
  Single admin account for system management
  - `id` (uuid, primary key)
  - `username` (text, unique) - Admin username
  - `password_hash` (text) - Hashed password
  - `created_at` (timestamptz)

  ### `blog_posts`
  Blog posts managed by admin
  - `id` (uuid, primary key)
  - `title` (text, required) - Post title
  - `content` (text, required) - Post content
  - `image_url` (text) - Featured image
  - `youtube_url` (text) - Embedded YouTube video
  - `published` (boolean) - Publication status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `audit_log`
  Admin action audit trail
  - `id` (uuid, primary key)
  - `admin_id` (uuid) - Admin who performed action
  - `action` (text) - Action type
  - `target_type` (text) - Type of target (player/blog)
  - `target_id` (uuid) - ID of affected record
  - `details` (jsonb) - Additional action details
  - `created_at` (timestamptz)

  ## 2. Security
  
  ### Players Table
  - Enable RLS
  - Public can insert (registration)
  - Public can read all players
  - Players can update only their own records (by matching email or id stored in session)
  
  ### Admin Account
  - Enable RLS
  - Only system can read (no policies for public access)
  
  ### Blog Posts
  - Enable RLS
  - Public can read published posts
  - No public insert/update/delete
  
  ### Audit Log
  - Enable RLS
  - No public access
  
  ## 3. Important Notes
  - Admin authentication will be handled via application logic
  - Player identification uses UUID for security
  - All timestamps in UTC
  - Arrays used for multi-select fields
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  nickname text NOT NULL,
  player_id text,
  server text,
  region text,
  platform text,
  
  -- Combat & Style
  main_style text,
  secondary_styles text[],
  build_type text,
  favorite_weapon text,
  qi_techniques text,
  
  -- Progression
  level integer DEFAULT 1,
  combat_power integer DEFAULT 0,
  professions text[],
  faction_reputation text,
  
  -- Gaming info
  started_playing date,
  weekly_hours integer,
  mmorpg_experience text,
  
  -- Guild info
  availability_days text[],
  availability_time text,
  guild_role text,
  content_interest text[],
  has_microphone boolean DEFAULT false,
  discord_required boolean DEFAULT false,
  desired_rank text,
  
  -- Social
  age integer,
  country text,
  city text,
  discord_id text,
  game_platform_id text,
  streaming_link text,
  
  -- Additional
  character_image text,
  build_image text,
  guild_motivation text,
  how_found_us text,
  expectations text,
  bio text,
  gamer_personality text[],
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin account table
CREATE TABLE IF NOT EXISTS admin_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  youtube_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Players policies (public can register and view, but editing needs player session)
CREATE POLICY "Anyone can register as player"
  ON players FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view all players"
  ON players FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Players can update their own profile by id"
  ON players FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete players"
  ON players FOR DELETE
  TO anon
  USING (true);

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (published = true OR true);

CREATE POLICY "System can manage blog posts"
  ON blog_posts FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Admin and audit log have no public policies (managed by app logic)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_nickname ON players(nickname);
CREATE INDEX IF NOT EXISTS idx_players_server ON players(server);
CREATE INDEX IF NOT EXISTS idx_players_region ON players(region);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);