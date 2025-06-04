-- Sample data for testing the wlanvi platform
-- Run this after all migrations are complete

-- Insert sample locations
INSERT INTO public.locations (name, address, type, additional_cost, is_active) VALUES
('wlanvi Home Studio', '123 Music Lane, Harmony City, HC 12345', 'home_studio', 0.00, true),
('Community Arts Center', '456 Arts Avenue, Harmony City, HC 12345', 'community_center', 0.00, true),
('Downtown Music Hall', '789 Concert Street, Harmony City, HC 12345', 'community_center', 10.00, true),
('Student Home Visit', 'Various Locations', 'student_home', 20.00, true);

-- Insert sample events
INSERT INTO public.events (title, description, event_type, event_date, event_time, location, max_participants, is_public, registration_required, price) VALUES
('Spring Recital 2024', 'Annual spring recital featuring students from all instrument programs. Come celebrate the musical achievements of our talented students!', 'recital', '2024-05-15', '19:00:00', 'Community Arts Center', 100, true, false, 0.00),
('Guitar Workshop: Advanced Techniques', 'Workshop covering advanced guitar techniques including fingerpicking, harmonics, and alternate tunings.', 'workshop', '2024-04-20', '14:00:00', 'wlanvi Home Studio', 8, true, true, 25.00),
('Piano Masterclass with Guest Artist', 'Special masterclass featuring renowned pianist Sarah Chen. Open to intermediate and advanced students.', 'masterclass', '2024-04-10', '16:00:00', 'Downtown Music Hall', 15, true, true, 15.00),
('Summer Concert Series Kickoff', 'Join us for the first concert of our summer series featuring student and teacher performances.', 'concert', '2024-06-01', '18:30:00', 'Community Arts Center', 150, true, false, 0.00);

-- Note: User data will be created through the authentication system
-- The following would be inserted when users register:

-- Sample notification preferences (will be created automatically for new users)
-- Sample assignments and lessons will be created through the application interface
