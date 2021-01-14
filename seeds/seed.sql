BEGIN;

TRUNCATE ingredients, instructions, recipe_tags, tags, recipes, recipe_box_users
RESTART IDENTITY CASCADE;

INSERT INTO recipe_box_users (username, full_name, password)
VALUES 
('testuser', 'test user', '$2a$12$.yPZ0O4snWoYH/QG3I0EiujhAoLmAfNr8YxHmIsTMJuHlO1MB3VjG'),
-- Password for leah is HiddenPassword12!
('nick', 'nick d', '$2a$12$xwnjhIiXL8bKl214MyWzZO6EbEk25wzhg1Z7j/ViPZwq77QdIHFTW');
-- Password for nick is NicksPassword4@!

INSERT INTO recipes (user_id, title)
VALUES
(1, 'Pancakes'),
(1, 'Pasta'),
(1, 'Granola'),
(1, 'Waffles'),
(1, 'Pea Soup');

INSERT INTO tags (tag_name)
VALUES
('Dinner'),
('Lunch'),
('Breakfast');

INSERT INTO recipe_tags (tag_id, recipe_id)
VALUES
(3, 1),
(1, 2),
(2, 2),
(3, 4),
(1, 5);

INSERT INTO ingredients (food_item, amount, recipe_id, unit)
VALUES
('olive oil', '4', 2, 'tbs'),
('choppped onion', '1', 2, 'cup'),
('minced garlic', '2', 2, 'tsp'),
('spaghetti', '1', 2, 'lb'),
('crushed tomatoes', '24', 2, 'oz'),
('salt', '1', 2, 'tsp'),
('pepper', '1', 2, 'tsp'),
('olive oil', '5', 5, 'tbs'),
('chopped onion', '1', 5, 'cup'),
('split peas', '1', 5, 'lb'),
('minced garlic', '2', 5, 'tsp'),
('ham hocks', '2', 5, 'lbs'),
('chicken stock', '8', 5, 'cups'),
('salt', '1', 5, 'tsp'),
('pepper', '2', 5, 'tsp');

INSERT INTO instructions (recipe_id, list_order, step_info)
VALUES
(2, '1', 'Heat olive oil in medium saute pan over medium heat until oil is shimmering. Add onions and cook until translucent, about 5-8 min. Add garlic and cook 1 min or until fragrant'),
(2, '2', 'Add salt, pepper, and crushed tomatoes to the saute pan. Stir until combined'),
(2, '3', 'Bring tomato mixture to a boil and then set the heat to low. Let simmer covered for 1hr'),
(2, '4', 'While the sauce simmers, bring a large pot of heavily salted water to a boil. Add spaghetti and cook until al dente'),
(2, '5', 'Drain pasta and add it to the simmering sauce. Mix until pasta is covered and serve!'),
(5, '1', 'Heat olive oil in a large cast iron pot over medium heat'),
(5, '2', 'Add onions to oil and cook until translucent. About 5-8 min. Add garlic and cook 1 min or until fragrant'),
(5, '3', 'Add split peas and mix until coated with oil'),
(5, '4', 'Add ham hocks, chicken stock, salt, and peper. Bring soup to a boil, then set the heat to low and let simmer, uncovered, for 1 hour. Be sure to mix every 20 min'),
(5, '5', 'When soup is thick, take off heat and serve.');

COMMIT;