// Curated furniture suggestion data with verified Unsplash photo IDs
const unsplash = (id, w = 300, h = 300) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;

export const furnitureSuggestions = {
  Chair: [
    { id: 's_chair_1', name: 'Modern Arm Chair', style: 'Modern', material: 'Fabric', color: 'Beige', image: unsplash('1567538096630-e0c55bd6374c') },
    { id: 's_chair_2', name: 'Lounge Chair', style: 'Contemporary', material: 'Leather', color: 'Grey', image: unsplash('1555041469-a586c61ea9bc') },
    { id: 's_chair_3', name: 'Velvet Accent Chair', style: 'Glam', material: 'Velvet', color: 'Emerald', image: unsplash('1586023492125-27b2c045efd7') },
    { id: 's_chair_4', name: 'Shell Chair', style: 'Scandinavian', material: 'Molded Plastic', color: 'White', image: unsplash('1506439773649-6e0eb8cfb237') },
    { id: 's_chair_5', name: 'Mid Century Chair', style: 'Mid-Century', material: 'Walnut & Fabric', color: 'Tan', image: unsplash('1592078615290-033ee584e267') },
    { id: 's_chair_6', name: 'Rattan Chair', style: 'Bohemian', material: 'Rattan', color: 'Natural', image: unsplash('1561677978-583a3b855d1d') },
    { id: 's_chair_7', name: 'Leather Arm Chair', style: 'Classic', material: 'Leather', color: 'Brown', image: unsplash('1598300042247-d088f8ab3a91') },
    { id: 's_chair_8', name: 'Tufted Chair', style: 'Victorian', material: 'Velvet', color: 'Ivory', image: unsplash('1601628828688-632f38a5a7d0') },
    { id: 's_chair_9', name: 'Wingback Chair', style: 'Traditional', material: 'Fabric', color: 'Grey', image: unsplash('1519947486511-46149fa0a254') },
    { id: 's_chair_10', name: 'Accent Chair', style: 'Eclectic', material: 'Boucle', color: 'Cream', image: unsplash('1555041469-a586c61ea9bc') },
    { id: 's_chair_11', name: 'Wooden Chair', style: 'Rustic', material: 'Oak Wood', color: 'Walnut', image: unsplash('1506439773649-6e0eb8cfb237') },
    { id: 's_chair_12', name: 'Minimal Chair', style: 'Minimalist', material: 'Steel & Leather', color: 'Black', image: unsplash('1592078615290-033ee584e267') },
  ],
  Sofa: [
    { id: 's_sofa_1', name: 'Modern Sectional', style: 'Modern', material: 'Linen', color: 'Grey', image: unsplash('1555041469-a586c61ea9bc') },
    { id: 's_sofa_2', name: 'Chesterfield Sofa', style: 'Classic', material: 'Leather', color: 'Cognac', image: unsplash('1493663284031-b7e3aefcae8e') },
    { id: 's_sofa_3', name: 'Velvet Sofa', style: 'Glam', material: 'Velvet', color: 'Navy', image: unsplash('1524758631624-e2822e304c36') },
    { id: 's_sofa_4', name: 'L-Shape Sofa', style: 'Contemporary', material: 'Fabric', color: 'Beige', image: unsplash('1555041469-a586c61ea9bc') },
    { id: 's_sofa_5', name: 'Mid-Century Sofa', style: 'Mid-Century', material: 'Tweed', color: 'Mustard', image: unsplash('1493663284031-b7e3aefcae8e') },
    { id: 's_sofa_6', name: 'Minimalist Sofa', style: 'Minimalist', material: 'Cotton', color: 'White', image: unsplash('1524758631624-e2822e304c36') },
    { id: 's_sofa_7', name: 'Rattan Sofa', style: 'Bohemian', material: 'Rattan & Cushion', color: 'Natural', image: unsplash('1561677978-583a3b855d1d') },
    { id: 's_sofa_8', name: 'Scandinavian Sofa', style: 'Scandinavian', material: 'Wool', color: 'Light Grey', image: unsplash('1555041469-a586c61ea9bc') },
    { id: 's_sofa_9', name: 'Luxury Sofa', style: 'Luxury', material: 'Italian Leather', color: 'Cream', image: unsplash('1524758631624-e2822e304c36') },
  ],
  Table: [
    { id: 's_table_1', name: 'Glass Coffee Table', style: 'Modern', material: 'Glass & Steel', color: 'Clear', image: unsplash('1533090161767-e6ffed986c88') },
    { id: 's_table_2', name: 'Marble Dining Table', style: 'Luxury', material: 'Marble', color: 'White', image: unsplash('1556909114-f6e7ad7d3136') },
    { id: 's_table_3', name: 'Oak Dining Table', style: 'Scandinavian', material: 'Oak Wood', color: 'Natural', image: unsplash('1533090161767-e6ffed986c88') },
    { id: 's_table_4', name: 'Industrial Table', style: 'Industrial', material: 'Steel & Wood', color: 'Dark', image: unsplash('1556909114-f6e7ad7d3136') },
    { id: 's_table_5', name: 'Round Dining Table', style: 'Classic', material: 'Walnut', color: 'Brown', image: unsplash('1533090161767-e6ffed986c88') },
    { id: 's_table_6', name: 'Extendable Table', style: 'Contemporary', material: 'MDF & Steel', color: 'White', image: unsplash('1556909114-f6e7ad7d3136') },
  ],
  'Console Table': [
    { id: 's_console_1', name: 'Gold Console Table', style: 'Glam', material: 'Metal & Glass', color: 'Gold', image: unsplash('1533090161767-e6ffed986c88') },
    { id: 's_console_2', name: 'Minimal Console', style: 'Minimalist', material: 'Solid Wood', color: 'White', image: unsplash('1556909114-f6e7ad7d3136') },
    { id: 's_console_3', name: 'Marble Console', style: 'Luxury', material: 'Marble & Brass', color: 'White/Gold', image: unsplash('1533090161767-e6ffed986c88') },
    { id: 's_console_4', name: 'Rattan Console', style: 'Bohemian', material: 'Rattan', color: 'Natural', image: unsplash('1561677978-583a3b855d1d') },
    { id: 's_console_5', name: 'Industrial Console', style: 'Industrial', material: 'Iron & Wood', color: 'Black', image: unsplash('1556909114-f6e7ad7d3136') },
    { id: 's_console_6', name: 'Wooden Console', style: 'Rustic', material: 'Reclaimed Wood', color: 'Walnut', image: unsplash('1533090161767-e6ffed986c88') },
  ],
  Plant: [
    { id: 's_plant_1', name: 'Fiddle Leaf Fig', style: 'Tropical', material: 'Live Plant', color: 'Green', image: unsplash('1501004318641-b39e6451bec6') },
    { id: 's_plant_2', name: 'Monstera', style: 'Tropical', material: 'Live Plant', color: 'Dark Green', image: unsplash('1545239351-ef35f43d514b') },
    { id: 's_plant_3', name: 'Snake Plant', style: 'Minimalist', material: 'Live Plant', color: 'Green/Yellow', image: unsplash('1509423350716-97f9360b4e09') },
    { id: 's_plant_4', name: 'Potted Olive Tree', style: 'Mediterranean', material: 'Live Plant', color: 'Silver Green', image: unsplash('1501004318641-b39e6451bec6') },
    { id: 's_plant_5', name: 'Palm Tree', style: 'Tropical', material: 'Live Plant', color: 'Green', image: unsplash('1545239351-ef35f43d514b') },
    { id: 's_plant_6', name: 'Succulent Arrangement', style: 'Modern', material: 'Live Plants', color: 'Mixed Green', image: unsplash('1509423350716-97f9360b4e09') },
  ],
  Rug: [
    { id: 's_rug_1', name: 'Persian Rug', style: 'Classic', material: 'Wool', color: 'Red/Blue', image: unsplash('1558618666-fcd25c85cd64') },
    { id: 's_rug_2', name: 'Geometric Rug', style: 'Modern', material: 'Cotton', color: 'Grey/White', image: unsplash('1567016432779-094069958ea5') },
    { id: 's_rug_3', name: 'Shaggy Rug', style: 'Cozy', material: 'Synthetic', color: 'Cream', image: unsplash('1558618666-fcd25c85cd64') },
    { id: 's_rug_4', name: 'Jute Rug', style: 'Bohemian', material: 'Natural Jute', color: 'Natural', image: unsplash('1567016432779-094069958ea5') },
    { id: 's_rug_5', name: 'Abstract Rug', style: 'Contemporary', material: 'Polyester', color: 'Multicolor', image: unsplash('1558618666-fcd25c85cd64') },
    { id: 's_rug_6', name: 'Moroccan Rug', style: 'Bohemian', material: 'Wool', color: 'Black/White', image: unsplash('1567016432779-094069958ea5') },
  ],
  'Pendant Light': [
    { id: 's_pend_1', name: 'Glass Globe Pendant', style: 'Modern', material: 'Glass & Brass', color: 'Gold', image: unsplash('1513506003901-1e6a35d44e4b') },
    { id: 's_pend_2', name: 'Rattan Pendant', style: 'Bohemian', material: 'Rattan', color: 'Natural', image: unsplash('1565814329452-e462eefd37e3') },
    { id: 's_pend_3', name: 'Geometric Pendant', style: 'Industrial', material: 'Metal', color: 'Black', image: unsplash('1513506003901-1e6a35d44e4b') },
    { id: 's_pend_4', name: 'Cluster Pendant', style: 'Eclectic', material: 'Glass', color: 'Clear', image: unsplash('1565814329452-e462eefd37e3') },
    { id: 's_pend_5', name: 'Drum Pendant', style: 'Classic', material: 'Fabric', color: 'White', image: unsplash('1513506003901-1e6a35d44e4b') },
    { id: 's_pend_6', name: 'Crystal Chandelier', style: 'Luxury', material: 'Crystal', color: 'Clear/Gold', image: unsplash('1565814329452-e462eefd37e3') },
  ],
  'Wall Panel': [
    { id: 's_wp_1', name: 'Fluted Panel', style: 'Modern', material: 'MDF', color: 'White', image: unsplash('1513519245088-0e12902e5a38') },
    { id: 's_wp_2', name: 'Shiplap Panel', style: 'Rustic', material: 'Wood', color: 'Whitewash', image: unsplash('1513519245088-0e12902e5a38') },
    { id: 's_wp_3', name: 'Marble Panel', style: 'Luxury', material: 'Marble', color: 'White/Grey', image: unsplash('1513519245088-0e12902e5a38') },
    { id: 's_wp_4', name: 'Wainscoting Panel', style: 'Classic', material: 'Wood', color: 'Cream', image: unsplash('1513519245088-0e12902e5a38') },
    { id: 's_wp_5', name: '3D Textured Panel', style: 'Contemporary', material: 'Gypsum', color: 'White', image: unsplash('1513519245088-0e12902e5a38') },
    { id: 's_wp_6', name: 'Geometric Panel', style: 'Art Deco', material: 'Metal', color: 'Gold', image: unsplash('1513519245088-0e12902e5a38') },
  ],
  Vase: [
    { id: 's_vase_1', name: 'Ceramic Vase', style: 'Modern', material: 'Ceramic', color: 'White', image: unsplash('1578500351012-91c7080d0ef4') },
    { id: 's_vase_2', name: 'Glass Vase', style: 'Minimalist', material: 'Glass', color: 'Clear', image: unsplash('1578500351012-91c7080d0ef4') },
    { id: 's_vase_3', name: 'Terracotta Vase', style: 'Mediterranean', material: 'Terracotta', color: 'Orange', image: unsplash('1578500351012-91c7080d0ef4') },
    { id: 's_vase_4', name: 'Nordic Vase', style: 'Scandinavian', material: 'Stoneware', color: 'Matte Grey', image: unsplash('1578500351012-91c7080d0ef4') },
  ],
  'Flower Vase': [
    { id: 's_fv_1', name: 'Floral Centerpiece', style: 'Classic', material: 'Crystal & Flowers', color: 'Mixed', image: unsplash('1578500351012-91c7080d0ef4') },
    { id: 's_fv_2', name: 'Dried Flower Vase', style: 'Bohemian', material: 'Ceramic & Dried Flowers', color: 'Earth Tones', image: unsplash('1578500351012-91c7080d0ef4') },
    { id: 's_fv_3', name: 'Modern Floral Vase', style: 'Modern', material: 'Glass & Fresh Flowers', color: 'White/Green', image: unsplash('1578500351012-91c7080d0ef4') },
    { id: 's_fv_4', name: 'Tall Floral Vase', style: 'Luxury', material: 'Marble & Flowers', color: 'White', image: unsplash('1578500351012-91c7080d0ef4') },
  ],
  Door: [
    { id: 's_door_1', name: 'French Door', style: 'Classic', material: 'Wood & Glass', color: 'White', image: unsplash('1558618047-3c8d69b6b7b5') },
    { id: 's_door_2', name: 'Pivot Door', style: 'Modern', material: 'Steel', color: 'Black', image: unsplash('1558618047-3c8d69b6b7b5') },
    { id: 's_door_3', name: 'Barn Door', style: 'Rustic', material: 'Reclaimed Wood', color: 'Grey', image: unsplash('1558618047-3c8d69b6b7b5') },
    { id: 's_door_4', name: 'Arched Door', style: 'Mediterranean', material: 'Carved Wood', color: 'Walnut', image: unsplash('1558618047-3c8d69b6b7b5') },
  ],
};

// Fallback suggestions for any unrecognized category
export const defaultSuggestions = [
  { id: 's_def_1', name: 'Modern Version', style: 'Modern', material: 'Mixed', color: 'White', image: unsplash('1555041469-a586c61ea9bc') },
  { id: 's_def_2', name: 'Classic Version', style: 'Classic', material: 'Wood', color: 'Natural', image: unsplash('1506439773649-6e0eb8cfb237') },
  { id: 's_def_3', name: 'Minimal Version', style: 'Minimalist', material: 'Steel', color: 'Black', image: unsplash('1592078615290-033ee584e267') },
  { id: 's_def_4', name: 'Luxury Version', style: 'Luxury', material: 'Marble', color: 'White', image: unsplash('1533090161767-e6ffed986c88') },
  { id: 's_def_5', name: 'Scandinavian Version', style: 'Scandinavian', material: 'Light Wood', color: 'Beige', image: unsplash('1519947486511-46149fa0a254') },
  { id: 's_def_6', name: 'Industrial Version', style: 'Industrial', material: 'Iron & Wood', color: 'Dark', image: unsplash('1598300042247-d088f8ab3a91') },
];

export function getSuggestionsForCategory(category) {
  return furnitureSuggestions[category] || defaultSuggestions;
}

export const styleFilters = ['All', 'Modern', 'Classic', 'Minimal', 'Luxury', 'Scandinavian', 'Bohemian', 'Industrial'];
