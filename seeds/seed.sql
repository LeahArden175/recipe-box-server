BEGIN;

TRUNCATE TABLE  ingredients, instructions, recipe_tags, tags, recipes, recipe_box_users;

INSERT INTO recipe_box_users (id, username, full_name, password)
VALUES 
( 1, 'leah', 'leah arden', 'replacewithhashpass'),
(2, 'nick', 'nick d', 'newpassreplace');

INSERT INTO recipes (id, user_id, title)
VALUES
(1, 1, 'Pancakes'),
(2, 1, 'Pasta'),
(3, 1, 'Granola'),
(4, 1, 'Waffles'),
(5, 1, 'Pea Soup');

INSERT INTO tags (id, tag_name)
VALUES
(1, 'Dinner'),
(2, 'Lunch'),
(3, 'Breakfast');

INSERT INTO recipe_tags (id, tag_id, recipe_id)
VALUES
(1, 3, 1),
(2, 1, 2),
(3, 2, 2),
(4, 3, 4),
(5, 1, 5);

INSERT INTO ingredients (id, food_item, amount, recipe_id, unit)
VALUES
(1, 'olive oil', '4', 2, 'tbs'),
(2, 'choppped onion', '1', 2, 'cup'),
(3, 'minced garlic', '2', 2, 'tsp'),
(4, 'spaghetti', '1', 2, 'lb'),
(5, 'crushed tomatoes', '24', 2, 'oz'),
(6, 'salt', '1', 2, 'tsp'),
(7, 'pepper', '1', 2, 'tsp'),
(8, 'olive oil', '5', 5, 'tbs'),
(9, 'chopped onion', '1', 5, 'cup'),
(10, 'split peas', '1', 5, 'lb'),
(11, 'minced garlic', '2', 5, 'tsp'),
(12, 'ham hocks', '2', 5, 'lbs'),
(13, 'chicken stock', '8', 5, 'cups'),
(14, 'salt', '1', 5, 'tsp'),
(15, 'pepper', '2', 5, 'tsp');

INSERT INTO instructions (id, recipe_id, list_order, step_info)
VALUES
(1, 2, '1', 'Heat olive oil in medium saute pan over medium heat until oil is shimmering. Add onions and cook until translucent, about 5-8 min. Add garlic and cook 1 min or until fragrant'),
(2, 2, '2', 'Add salt, pepper, and crushed tomatoes to the saute pan. Stir until combined'),
(3, 2, '3', 'Bring tomato mixture to a boil and then set the heat to low. Let simmer covered for 1hr'),
(4, 2, '4', 'While the sauce simmers, bring a large pot of heavily salted water to a boil. Add spaghetti and cook until al dente'),
(5, 2, '5', 'Drain pasta and add it to the simmering sauce. Mix until pasta is covered and serve!'),
(6, 5, '1', 'Heat olive oil in a large cast iron pot over medium heat'),
(7, 5, '2', 'Add onions to oil and cook until translucent. About 5-8 min. Add garlic and cook 1 min or until fragrant'),
(8, 5, '3', 'Add split peas and mix until coated with oil'),
(9, 5, '4', 'Add ham hocks, chicken stock, salt, and peper. Bring soup to a boil, then set the heat to low and let simmer, uncovered, for 1 hour. Be sure to mix every 20 min'),
(10, 5, '5', 'When soup is thick, take off heat and serve.');

COMMIT;