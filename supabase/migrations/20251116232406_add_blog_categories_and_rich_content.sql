/*
  # Add Blog Categories and Rich Content Support

  1. Changes
    - Add `category` column to blog_posts table for post categorization
    - Add `content_json` column to store rich text content with formatting
    - Create index on category for efficient filtering
  
  2. Categories
    - Build: Character builds and equipment guides
    - Leveling: Progression and leveling tips
    - PvP: Player versus player content
    - PvE: Dungeons, raids, and PvE content
    - Guide: General game guides
    - News: News and announcements
    - Event: Guild and game events
    - Discussion: Community discussions
  
  3. Rich Content
    - content_json will store formatted content with:
      - Text with different sizes and colors
      - Embedded images
      - Formatted paragraphs
    - content field remains for backward compatibility
*/

-- Add category column to blog_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'category'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN category text DEFAULT 'Guide';
  END IF;
END $$;

-- Add content_json column for rich text content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'content_json'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN content_json jsonb;
  END IF;
END $$;

-- Create index on category for efficient filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
