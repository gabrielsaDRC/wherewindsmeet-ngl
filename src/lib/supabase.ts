import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Player = {
  id: string;
  nickname: string;
  player_id?: string;
  server?: string;
  region?: string;
  platform?: string;
  main_style?: string;
  secondary_styles?: string[];
  build_type?: string;
  favorite_weapon?: string;
  qi_techniques?: string;
  level?: number;
  combat_power?: number;
  professions?: string[];
  faction_reputation?: string;
  started_playing?: string;
  weekly_hours?: number;
  mmorpg_experience?: string;
  availability_days?: string[];
  availability_time?: string;
  guild_role?: string;
  content_interest?: string[];
  has_microphone?: boolean;
  discord_required?: boolean;
  desired_rank?: string;
  age?: number;
  country?: string;
  city?: string;
  discord_id?: string;
  game_platform_id?: string;
  streaming_link?: string;
  character_image?: string;
  build_image?: string;
  guild_motivation?: string;
  how_found_us?: string;
  expectations?: string;
  bio?: string;
  gamer_personality?: string[];
  created_at?: string;
  updated_at?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  category?: string;
  content_json?: any;
  image_url?: string;
  youtube_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};
