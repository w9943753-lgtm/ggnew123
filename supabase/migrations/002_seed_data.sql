-- Hafiz Store - Seed Data (Clean Version)

-- CATEGORIES (parent)
INSERT INTO categories (id, name, slug, description, image, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', 'Fresh Vegetables', 'fresh-vegetables', 'Fresh vegetables from local farms', '/images/categories/veg.jpg', 1),
('10000000-0000-0000-0000-000000000002', 'Fresh Fruits', 'fresh-fruits', 'Premium quality fresh fruits', '/images/categories/fruits.jpg', 2),
('10000000-0000-0000-0000-000000000003', 'Meat and Fish', 'meat-fish', 'Halal certified fresh meat and fish', '/images/categories/meat.jpg', 3),
('10000000-0000-0000-0000-000000000004', 'Dairy and Eggs', 'dairy-eggs', 'Fresh dairy products and eggs', '/images/categories/dairy.jpg', 4),
('10000000-0000-0000-0000-000000000005', 'Bakery', 'bakery', 'Fresh baked goods and bread', '/images/categories/bakery.jpg', 5),
('10000000-0000-0000-0000-000000000006', 'Frozen Foods', 'frozen-foods', 'Frozen foods and ready to cook', '/images/categories/frozen.jpg', 6),
('10000000-0000-0000-0000-000000000007', 'Snacks', 'snacks', 'Snacks and confectionery', '/images/categories/snacks.jpg', 7),
('10000000-0000-0000-0000-000000000008', 'Beverages', 'beverages', 'Drinks and beverages', '/images/categories/bev.jpg', 8),
('10000000-0000-0000-0000-000000000009', 'Cooking Essentials', 'cooking-essentials', 'Cooking oil, spices, rice, flour', '/images/categories/cook.jpg', 9),
('10000000-0000-0000-0000-000000000010', 'Cleaning Supplies', 'cleaning-supplies', 'Home cleaning products', '/images/categories/clean.jpg', 10),
('10000000-0000-0000-0000-000000000011', 'Personal Care', 'personal-care', 'Soaps, shampoo, handwash', '/images/categories/personal.jpg', 11),
('10000000-0000-0000-0000-000000000012', 'Baby Care', 'baby-care', 'Diapers and baby products', '/images/categories/baby.jpg', 12),
('10000000-0000-0000-0000-000000000013', 'Health', 'health', 'Medicines and health products', '/images/categories/health.jpg', 13);

-- SUBCATEGORIES (child categories with parent_id)
INSERT INTO categories (id, name, slug, description, image, parent_id, sort_order) VALUES
('20000000-0000-0000-0000-000000000001', 'Potatoes', 'potatoes', 'Fresh potatoes', '/images/sub/potato.jpg', '10000000-0000-0000-0000-000000000001', 1),
('20000000-0000-0000-0000-000000000002', 'Tomatoes', 'tomatoes', 'Fresh tomatoes', '/images/sub/tomato.jpg', '10000000-0000-0000-0000-000000000001', 2),
('20000000-0000-0000-0000-000000000003', 'Onions', 'onions', 'Fresh onions', '/images/sub/onion.jpg', '10000000-0000-0000-0000-000000000001', 3),
('20000000-0000-0000-0000-000000000004', 'Bananas', 'bananas', 'Fresh bananas', '/images/sub/banana.jpg', '10000000-0000-0000-0000-000000000002', 1),
('20000000-0000-0000-0000-000000000005', 'Apples', 'apples', 'Fresh apples', '/images/sub/apple.jpg', '10000000-0000-0000-0000-000000000002', 2),
('20000000-0000-0000-0000-000000000006', 'Mangoes', 'mangoes', 'Fresh mangoes', '/images/sub/mango.jpg', '10000000-0000-0000-0000-000000000002', 3),
('20000000-0000-0000-0000-000000000007', 'Chicken', 'chicken', 'Fresh chicken', '/images/sub/chicken.jpg', '10000000-0000-0000-0000-000000000003', 1),
('20000000-0000-0000-0000-000000000008', 'Beef', 'beef', 'Fresh beef', '/images/sub/beef.jpg', '10000000-0000-0000-0000-000000000003', 2),
('20000000-0000-0000-0000-000000000009', 'Mutton', 'mutton', 'Fresh mutton', '/images/sub/mutton.jpg', '10000000-0000-0000-0000-000000000003', 3),
('20000000-0000-0000-0000-000000000010', 'Milk', 'milk', 'Fresh milk', '/images/sub/milk.jpg', '10000000-0000-0000-0000-000000000004', 1),
('20000000-0000-0000-0000-000000000011', 'Eggs', 'eggs', 'Farm fresh eggs', '/images/sub/eggs.jpg', '10000000-0000-0000-0000-000000000004', 2),
('20000000-0000-0000-0000-000000000012', 'Bread', 'bread', 'Fresh bread', '/images/sub/bread.jpg', '10000000-0000-0000-0000-000000000005', 1),
('20000000-0000-0000-0000-000000000013', 'Biscuits', 'biscuits', 'Biscuits and cookies', '/images/sub/biscuit.jpg', '10000000-0000-0000-0000-000000000005', 2),
('20000000-0000-0000-0000-000000000014', 'Soft Drinks', 'soft-drinks', 'Carbonated drinks', '/images/sub/soda.jpg', '10000000-0000-0000-0000-000000000008', 1),
('20000000-0000-0000-0000-000000000015', 'Tea and Coffee', 'tea-coffee', 'Tea and coffee products', '/images/sub/tea.jpg', '10000000-0000-0000-0000-000000000008', 2),
('20000000-0000-0000-0000-000000000016', 'Spices', 'spices', 'Spices and masalas', '/images/sub/spice.jpg', '10000000-0000-0000-0000-000000000009', 1),
('20000000-0000-0000-0000-000000000017', 'Cooking Oil', 'cooking-oil', 'Cooking oils', '/images/sub/oil.jpg', '10000000-0000-0000-0000-000000000009', 2),
('20000000-0000-0000-0000-000000000018', 'Rice and Flour', 'rice-flour', 'Rice flour and grains', '/images/sub/rice.jpg', '10000000-0000-0000-0000-000000000009', 3),
('20000000-0000-0000-0000-000000000019', 'Detergent', 'detergent', 'Laundry detergents', '/images/sub/detergent.jpg', '10000000-0000-0000-0000-000000000010', 1),
('20000000-0000-0000-0000-000000000020', 'Soaps', 'soaps', 'Bathing soaps', '/images/sub/soap.jpg', '10000000-0000-0000-0000-000000000011', 1),
('20000000-0000-0000-0000-000000000021', 'Shampoo', 'shampoo', 'Hair shampoos', '/images/sub/shampoo.jpg', '10000000-0000-0000-0000-000000000011', 2),
('20000000-0000-0000-0000-000000000022', 'Water', 'water', 'Drinking water', '/images/sub/water.jpg', '10000000-0000-0000-0000-000000000008', 3);

-- BRANDS
INSERT INTO brands (id, name, slug, logo, description) VALUES
('30000000-0000-0000-0000-000000000001', 'Surf Excel', 'surf-excel', '/images/brands/surf.png', 'Laundry detergent'),
('30000000-0000-0000-0000-000000000002', 'Ariel', 'ariel', '/images/brands/ariel.png', 'Laundry detergent'),
('30000000-0000-0000-0000-000000000003', 'Shan', 'shan', '/images/brands/shan.png', 'Spices brand'),
('30000000-0000-0000-0000-000000000004', 'National', 'national', '/images/brands/national.png', 'Food brand'),
('30000000-0000-0000-0000-000000000005', 'Tapal', 'tapal', '/images/brands/tapal.png', 'Tea brand'),
('30000000-0000-0000-0000-000000000006', 'Lipton', 'lipton', '/images/brands/lipton.png', 'Tea brand'),
('30000000-0000-0000-0000-000000000007', 'Nestle', 'nestle', '/images/brands/nestle.png', 'Food company'),
('30000000-0000-0000-0000-000000000008', 'Olper', 'olper', '/images/brands/olper.png', 'Dairy brand'),
('30000000-0000-0000-0000-000000000009', 'Dalda', 'dalda', '/images/brands/dalda.png', 'Cooking oil'),
('30000000-0000-0000-0000-000000000010', 'Knorr', 'knorr', '/images/brands/knorr.png', 'Food brand'),
('30000000-0000-0000-0000-000000000011', 'Coca Cola', 'coca-cola', '/images/brands/cola.png', 'Soft drink'),
('30000000-0000-0000-0000-000000000012', 'Pepsi', 'pepsi', '/images/brands/pepsi.png', 'Soft drink'),
('30000000-0000-0000-0000-000000000013', 'Dawn Bread', 'dawn-bread', '/images/brands/dawn.png', 'Bread brand'),
('30000000-0000-0000-0000-000000000014', 'Lifebuoy', 'lifebuoy', '/images/brands/lifebuoy.png', 'Soap brand'),
('30000000-0000-0000-0000-000000000015', 'Lux', 'lux', '/images/brands/lux.png', 'Soap brand'),
('30000000-0000-0000-0000-000000000016', 'Dettol', 'dettol', '/images/brands/dettol.png', 'Antiseptic'),
('30000000-0000-0000-0000-000000000017', 'Mitchell', 'mitchell', '/images/brands/mitchell.png', 'Jams brand'),
('30000000-0000-0000-0000-000000000018', 'Peek Freans', 'peek-freans', '/images/brands/peek.png', 'Biscuit brand'),
('30000000-0000-0000-0000-000000000019', 'Nescafe', 'nescafe', '/images/brands/nescafe.png', 'Coffee brand'),
('30000000-0000-0000-0000-000000000020', 'Sprite', 'sprite', '/images/brands/sprite.png', 'Soft drink');

-- PRODUCTS (Fresh Vegetables)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000001', 'Fresh Potatoes', 'fresh-potatoes', 'Farm fresh potatoes perfect for curries and fries', 'VEG-001', '8901234567890', NULL, '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '1 kg', 'kg', 80.00, 65.00, 19, 300, ARRAY['/images/products/potato.jpg'], true, true, true, 4.5, 234),
('40000000-0000-0000-0000-000000000002', 'Fresh Tomatoes', 'fresh-tomatoes', 'Ripe and juicy tomatoes for salads and cooking', 'VEG-002', '8901234567891', NULL, '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '1 kg', 'kg', 120.00, 95.00, 21, 250, ARRAY['/images/products/tomato.jpg'], true, true, true, 4.3, 189),
('40000000-0000-0000-0000-000000000003', 'Fresh Onions', 'fresh-onions', 'Premium quality onions for every kitchen', 'VEG-003', '8901234567892', NULL, '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '1 kg', 'kg', 60.00, 50.00, 17, 400, ARRAY['/images/products/onion.jpg'], false, true, true, 4.4, 267);

-- PRODUCTS (Fresh Fruits)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000004', 'Fresh Bananas', 'fresh-bananas', 'Sweet ripe bananas rich in potassium', 'FRU-001', '8901234567893', NULL, '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', '1 dozen', 'pcs', 180.00, 150.00, 17, 500, ARRAY['/images/products/banana.jpg'], true, true, true, 4.6, 345),
('40000000-0000-0000-0000-000000000005', 'Fresh Apples', 'fresh-apples', 'Crisp juicy red apples from Murree', 'FRU-002', '8901234567894', NULL, '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', '1 kg', 'kg', 350.00, 300.00, 14, 200, ARRAY['/images/products/apple.jpg'], true, true, false, 4.7, 278),
('40000000-0000-0000-0000-000000000006', 'Fresh Mangoes', 'fresh-mangoes', 'Premium Sindhri mangoes the king of fruits', 'FRU-003', '8901234567895', NULL, '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '1 kg', 'kg', 400.00, 350.00, 13, 150, ARRAY['/images/products/mango.jpg'], true, true, true, 4.8, 412);

-- PRODUCTS (Meat)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000007', 'Fresh Chicken', 'fresh-chicken', 'Halal certified fresh whole chicken', 'MEA-001', '8901234567896', NULL, '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', '1 kg', 'kg', 750.00, 680.00, 9, 200, ARRAY['/images/products/chicken.jpg'], true, true, true, 4.5, 345),
('40000000-0000-0000-0000-000000000008', 'Fresh Beef', 'fresh-beef', 'Halal certified fresh beef tender cuts', 'MEA-002', '8901234567897', NULL, '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008', '1 kg', 'kg', 1200.00, 1050.00, 13, 120, ARRAY['/images/products/beef.jpg'], true, true, true, 4.4, 267),
('40000000-0000-0000-0000-000000000009', 'Fresh Mutton', 'fresh-mutton', 'Premium quality mutton tender and flavorful', 'MEA-003', '8901234567898', NULL, '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009', '1 kg', 'kg', 2200.00, 1950.00, 11, 80, ARRAY['/images/products/mutton.jpg'], true, false, false, 4.7, 156);

-- PRODUCTS (Dairy)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000010', 'Olper Milk 1L', 'olpers-milk', 'Premium full cream milk by Olper', 'DAI-001', '8901234567899', '30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000010', '1 L', 'L', 290.00, 270.00, 7, 400, ARRAY['/images/products/olper.jpg'], true, true, true, 4.6, 389),
('40000000-0000-0000-0000-000000000011', 'Fresh Eggs Dozen', 'fresh-eggs', 'Farm fresh eggs nutritious and wholesome', 'DAI-002', '8901234567900', NULL, '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', '1 dozen', 'pcs', 240.00, 210.00, 13, 500, ARRAY['/images/products/eggs.jpg'], true, true, true, 4.7, 456);

-- PRODUCTS (Bakery)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000012', 'Dawn Bread', 'dawn-bread', 'Fresh soft white bread by Dawn', 'BAK-001', '8901234567901', '30000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', '400 g', 'pcs', 75.00, 65.00, 13, 600, ARRAY['/images/products/bread.jpg'], true, true, true, 4.5, 523),
('40000000-0000-0000-0000-000000000013', 'Sooper Cookies', 'sooper-cookies', 'Delicious egg and milk cookies by Peek Freans', 'BAK-002', '8901234567902', '30000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', '348 g', 'pcs', 280.00, 250.00, 11, 300, ARRAY['/images/products/sooper.jpg'], true, true, true, 4.5, 234);

-- PRODUCTS (Beverages)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000014', 'Coca Cola 1.5L', 'coca-cola-1-5l', 'Refreshing Coca Cola world favorite soft drink', 'BEV-001', '8901234567903', '30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000014', '1.5 L', 'L', 210.00, 190.00, 10, 500, ARRAY['/images/products/cola.jpg'], true, true, true, 4.5, 456),
('40000000-0000-0000-0000-000000000015', 'Pepsi 1.5L', 'pepsi-1-5l', 'Thirst quenching Pepsi the new generation', 'BEV-002', '8901234567904', '30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000014', '1.5 L', 'L', 210.00, 190.00, 10, 480, ARRAY['/images/products/pepsi.jpg'], true, true, true, 4.4, 423),
('40000000-0000-0000-0000-000000000016', 'Aquafina Water 1.5L', 'aquafina-water', 'Pure safe drinking water by Aquafina', 'BEV-003', '8901234567905', '30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000022', '1.5 L', 'L', 60.00, 50.00, 17, 600, ARRAY['/images/products/aquafina.jpg'], false, true, true, 4.6, 345);

-- PRODUCTS (Cooking Essentials)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000017', 'Shan Biryani Masala', 'shan-biryani-masala', 'Premium biryani masala mix by Shan', 'COO-001', '8901234567906', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000016', '60 g', 'pcs', 180.00, 160.00, 11, 500, ARRAY['/images/products/shan.jpg'], true, true, true, 4.7, 523),
('40000000-0000-0000-0000-000000000018', 'Dalda Oil 3L', 'dalda-oil', 'Premium cooking oil by Dalda', 'COO-002', '8901234567907', '30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000017', '3 L', 'L', 1200.00, 1080.00, 10, 200, ARRAY['/images/products/dalda.jpg'], true, true, true, 4.6, 312),
('40000000-0000-0000-0000-000000000019', 'Basmati Rice 5kg', 'basmati-rice', 'Premium super kernel basmati rice', 'COO-003', '8901234567908', NULL, '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000018', '5 kg', 'kg', 1200.00, 1080.00, 10, 250, ARRAY['/images/products/rice.jpg'], true, true, true, 4.7, 389),
('40000000-0000-0000-0000-000000000020', 'Sugar 5kg', 'sugar', 'Fine quality sugar for your kitchen', 'COO-004', '8901234567909', NULL, '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000018', '5 kg', 'kg', 650.00, 600.00, 8, 400, ARRAY['/images/products/sugar.jpg'], true, true, true, 4.5, 456),
('40000000-0000-0000-0000-000000000021', 'Tapal Tea 950g', 'tapal-danedar', 'Premium tea blend by Tapal', 'COO-005', '8901234567910', '30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000015', '950 g', 'pcs', 650.00, 590.00, 9, 300, ARRAY['/images/products/tapal.jpg'], true, true, true, 4.6, 389),
('40000000-0000-0000-0000-000000000022', 'Lipton Tea 190g', 'lipton-tea', 'Classic black tea by Lipton', 'COO-006', '8901234567911', '30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000015', '190 g', 'pcs', 380.00, 340.00, 11, 350, ARRAY['/images/products/lipton.jpg'], true, true, true, 4.5, 312),
('40000000-0000-0000-0000-000000000023', 'Flour 5kg', 'maida-flour', 'Fine quality all purpose flour', 'COO-007', '8901234567912', NULL, '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000018', '5 kg', 'kg', 550.00, 500.00, 9, 300, ARRAY['/images/products/maida.jpg'], false, true, true, 4.4, 234),
('40000000-0000-0000-0000-000000000024', 'Knorr Cubes', 'knorr-cubes', 'Flavorful chicken bouillon cubes', 'COO-008', '8901234567913', '30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000016', '100 g', 'pcs', 220.00, 200.00, 9, 350, ARRAY['/images/products/knorr.jpg'], true, true, true, 4.5, 267);

-- PRODUCTS (Cleaning)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000025', 'Surf Excel 3kg', 'surf-excel', 'Advanced laundry detergent for machine wash', 'CLE-001', '8901234567914', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000019', '3 kg', 'pcs', 1850.00, 1700.00, 8, 200, ARRAY['/images/products/surf.jpg'], true, true, true, 4.6, 456),
('40000000-0000-0000-0000-000000000026', 'Ariel 3kg', 'ariel', 'Premium laundry detergent deep clean', 'CLE-002', '8901234567915', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000019', '3 kg', 'pcs', 2100.00, 1950.00, 7, 180, ARRAY['/images/products/ariel.jpg'], true, true, true, 4.7, 389);

-- PRODUCTS (Personal Care)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000027', 'Lifebuoy Handwash', 'lifebuoy-handwash', 'Antibacterial handwash 99.9% germ protection', 'PER-001', '8901234567916', '30000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000020', '250 ml', 'pcs', 220.00, 195.00, 11, 300, ARRAY['/images/products/lifebuoy.jpg'], true, true, true, 4.5, 345),
('40000000-0000-0000-0000-000000000028', 'Lux Soap', 'lux-soap', 'Premium beauty soap with moisturizing milk', 'PER-002', '8901234567917', '30000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000020', '125 g', 'pcs', 150.00, 130.00, 13, 400, ARRAY['/images/products/lux.jpg'], false, true, true, 4.4, 267),
('40000000-0000-0000-0000-000000000029', 'Dettol Soap', 'dettol-soap', 'Antiseptic soap for germ protection', 'PER-003', '8901234567918', '30000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000020', '115 g', 'pcs', 130.00, 115.00, 12, 350, ARRAY['/images/products/dettol.jpg'], false, true, true, 4.5, 289);

-- PRODUCTS (Snacks)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000030', 'Lays Chips', 'lays-chips', 'Crispy potato chips classic salted flavor', 'SNA-001', '8901234567919', NULL, '10000000-0000-0000-0000-000000000007', NULL, '52 g', 'pcs', 80.00, 70.00, 13, 500, ARRAY['/images/products/lays.jpg'], true, true, true, 4.4, 345);

-- PRODUCTS (Baby Care)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000031', 'MamyPoko Pants', 'mamypoko', 'Ultra-soft diapers for baby comfort', 'BAB-001', '8901234567920', NULL, '10000000-0000-0000-0000-000000000012', NULL, '40 pieces', 'pcs', 1500.00, 1350.00, 10, 200, ARRAY['/images/products/mamypoko.jpg'], true, true, true, 4.6, 345);

-- PRODUCTS (Health)
INSERT INTO products (id, name, slug, description, sku, barcode, brand_id, category_id, subcategory_id, weight, unit, price, discount_price, discount_percent, stock, images, is_featured, is_popular, is_top_seller, rating, reviews_count) VALUES
('40000000-0000-0000-0000-000000000032', 'Panadol 500mg', 'panadol', 'Effective pain reliever and fever reducer', 'HEA-001', '8901234567921', NULL, '10000000-0000-0000-0000-000000000013', NULL, '100 tablets', 'pcs', 350.00, 320.00, 9, 400, ARRAY['/images/products/panadol.jpg'], true, true, true, 4.7, 456);

-- COUPONS
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order, max_discount, usage_limit, is_active, expires_at) VALUES
('50000000-0000-0000-0000-000000000001', 'HAFIZ10', '10 percent off above Rs.1000', 'percentage', 10, 1000, 500, 1000, true, '2026-12-31'),
('50000000-0000-0000-0000-000000000002', 'WELCOME50', 'Rs.50 off on first order', 'fixed', 50, 500, NULL, 5000, true, '2026-12-31'),
('50000000-0000-0000-0000-000000000003', 'RAMADAN20', '20 percent off during Ramadan', 'percentage', 20, 2000, 1000, 2000, true, '2026-04-30'),
('50000000-0000-0000-0000-000000000004', 'FREEDELIVERY', 'Free delivery on orders above Rs.3000', 'fixed', 200, 3000, NULL, 10000, true, '2026-12-31');

-- BANNERS
INSERT INTO banners (id, title, subtitle, image, link, position, is_active, sort_order) VALUES
('60000000-0000-0000-0000-000000000001', 'Welcome to Hafiz Store', 'Quality Groceries at Best Prices', '/images/banners/welcome.jpg', '/', 'home', true, 1),
('60000000-0000-0000-0000-000000000002', 'Eid Mega Sale', 'Up to 50 percent off on all groceries', '/images/banners/eid.jpg', '/categories', 'home', true, 2),
('60000000-0000-0000-0000-000000000003', 'Free Delivery', 'On orders above Rs.3000', '/images/banners/delivery.jpg', '/categories', 'home', true, 3),
('60000000-0000-0000-0000-000000000004', 'Fresh Vegetables', 'Farm fresh delivered daily', '/images/banners/veg.jpg', '/category/fresh-vegetables', 'home', true, 4),
('60000000-0000-0000-0000-000000000005', 'Ramadan Deals', 'Special prices for Ramadan', '/images/banners/ramadan.jpg', '/categories', 'home', true, 5);
