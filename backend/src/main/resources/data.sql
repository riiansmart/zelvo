-- Insert default categories with colors
INSERT INTO categories (name, color, created_at) VALUES 
('Development', '#4CAF50', NOW()),
('Design', '#2196F3', NOW()),
('Marketing', '#FF9800', NOW()),
('Research', '#9C27B0', NOW()),
('Testing', '#F44336', NOW()),
('Documentation', '#00BCD4', NOW())
ON DUPLICATE KEY UPDATE name=name; 