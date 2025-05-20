-- Seed default categories on application startup
INSERT INTO categories (
  name,
  description,
  color,
  icon,
  created_at,
  updated_at,
  is_default
) VALUES
  ('Work', '', '#cccccc', '', NOW(), NOW(), false),
  ('Personal', '', '#cccccc', '', NOW(), NOW(), false),
  ('Shopping', '', '#cccccc', '', NOW(), NOW(), false),
  ('Urgent', '', '#cccccc', '', NOW(), NOW(), false)
ON CONFLICT (name) DO NOTHING; 