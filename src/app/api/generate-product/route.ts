import { NextRequest, NextResponse } from "next/server";

const productKnowledge: Record<string, { features: string[]; usage: string[]; desc: string }> = {
  "coca-cola": {
    desc: "Coca-Cola Original Taste is a refreshing carbonated soft drink with the iconic taste loved worldwide. Perfect for meals, parties, and everyday refreshment.",
    features: ["Authentic Coca-Cola taste", "Refreshing carbonated drink", "Perfect for sharing", "Best served chilled", "1.5L family size bottle"],
    usage: ["Serve chilled at 3-4°C", "Open and pour into a glass with ice for best experience", "Pair with meals, snacks, or enjoy on its own", "Store in a cool dry place away from sunlight"],
  },
  "sprite": {
    desc: "Sprite is a crisp, clear lemon-lime flavored soft drink that provides refreshment with a clean, fresh taste. Ideal for quenching your thirst.",
    features: ["Refreshing lemon-lime flavor", "Crisp and clean taste", "Caffeine-free formula", "1.5L family size", "Best served ice cold"],
    usage: ["Serve well chilled at 3-4°C", "Pour over ice cubes for extra refreshment", "Perfect companion with spicy food", "Reseal and refrigerate after opening"],
  },
  "pepsi": {
    desc: "Pepsi is a bold, refreshing cola beverage with a unique blend of flavors. A perfect choice for those who love a sweeter, more citrus-forward cola taste.",
    features: ["Bold cola flavor with citrus notes", "Refreshing and energizing", "Perfect for parties and gatherings", "Available in convenient sizes", "Best enjoyed ice cold"],
    usage: ["Serve chilled for最佳 taste", "Great as a mixer or standalone drink", "Pair with burgers, pizza, and snacks", "Refrigerate after opening"],
  },
  "rice": {
    desc: "Premium quality Basmati rice known for its exceptional aroma, extra-long grains, and fluffy texture when cooked. A staple in Pakistani cuisine.",
    features: ["Extra-long aromatic grains", "Premium quality selection", "Fluffy and non-sticky when cooked", "Rich natural aroma", "Ideal for biryani, pulao, and daily meals"],
    usage: ["Rinse 1 cup rice thoroughly in cold water", "Soak for 20-30 minutes before cooking", "Use 1.5 cups water per cup of rice", "Cook on low heat with lid on for 15-20 minutes", "Let rest 5 minutes before fluffing with a fork"],
  },
  "sugar": {
    desc: "Fine quality refined white sugar, perfect for sweetening your tea, coffee, desserts, and all your cooking and baking needs.",
    features: ["Pure refined white sugar", "Fine granulated texture", "Dissolves quickly in hot beverages", "Multi-purpose kitchen essential", "Hygienically packed for freshness"],
    usage: ["Add to taste in tea, coffee, and beverages", "Use in baking cakes, cookies, and pastries", "Perfect for making desserts and sweets", "Store in a cool, dry place in an airtight container"],
  },
  "lays": {
    desc: "Lay's Classic Salted potato chips are made from carefully selected potatoes, sliced thin and perfectly cooked to golden perfection with just the right amount of salt.",
    features: ["Crispy golden potato chips", "Classic salted flavor", "Made from real potatoes", "Perfectly sliced and cooked", "Resealable pack for freshness"],
    usage: ["Enjoy straight from the pack as a snack", "Perfect companion with sandwiches and burgers", "Great for picnics, parties, and movie nights", "Store in a cool, dry place away from direct sunlight"],
  },
  "milk": {
    desc: "Fresh full cream milk rich in calcium and Vitamin D, essential for strong bones and healthy growth. Pasteurized for safety and quality.",
    features: ["Rich in calcium and Vitamin D", "Full cream for creamy taste", "Pasteurized for safety", "Essential for growing families", "Perfect for tea, coffee, and cooking"],
    usage: ["Shake well before use", "Serve chilled or warm to your preference", "Use in tea, coffee, cereals, and desserts", "Refrigerate after opening and consume within 3 days"],
  },
  "bread": {
    desc: "Soft, fresh bread baked daily with premium ingredients. Perfect for sandwiches, toast, and everyday meals. A staple for every Pakistani household.",
    features: ["Freshly baked daily", "Soft and fluffy texture", "Made with premium flour", "No artificial preservatives", "Perfect for sandwiches and toast"],
    usage: ["Toast for breakfast with butter and jam", "Use for sandwiches and wraps", "Store in a bread box at room temperature", "Best consumed within 3-4 days of purchase"],
  },
  "oil": {
    desc: "Premium quality cooking oil/banaspati for healthy and delicious cooking. Suitable for frying, baking, and all your culinary needs.",
    features: ["100% pure and hygienic", "Low cholesterol formula", "High smoke point for frying", "Enhances food flavor", "Essential cooking staple"],
    usage: ["Use for deep frying, shallow frying, and sautéing", "Add to curries and vegetables while cooking", "Use in baking for moist textures", "Store in a cool, dry place away from heat and light"],
  },
  "chips": {
    desc: "Crispy, flavorful potato chips seasoned to perfection. A crunchy snack that satisfies your cravings anytime, anywhere.",
    features: ["Crispy and crunchy texture", "Perfectly seasoned", "Made from real potatoes", "Convenient snack pack", "Great for sharing"],
    usage: ["Enjoy as a standalone snack anytime", "Pair with sandwiches and burgers", "Perfect for parties and gatherings", "Reseal pack to maintain freshness"],
  },
  "tea": {
    desc: "Premium quality tea leaves carefully selected and blended to deliver a rich, aromatic cup of tea. A daily essential for true tea lovers.",
    features: ["Rich aromatic blend", "Full-bodied flavor", "Perfectly balanced taste", "Premium tea leaves", "Ideal for daily chai"],
    usage: ["Boil water and add tea leaves or tea bag", "Steep for 3-5 minutes for optimal flavor", "Add milk and sugar to taste", "Serve hot for best experience"],
  },
  "soap": {
    desc: "Gentle beauty bar that cleanses and nourishes your skin, leaving it soft, smooth, and beautifully fragranced throughout the day.",
    features: ["Gentle on skin", "Moisturizing formula", "Pleasant long-lasting fragrance", "Dermatologically tested", "Suitable for all skin types"],
    usage: ["Lather with water between palms", "Apply to wet skin and massage gently", "Rinse thoroughly with water", "Use daily for best results"],
  },
  "toothpaste": {
    desc: "Advanced formula toothpaste that provides comprehensive oral care with cooling crystals for fresh breath and strong, healthy teeth.",
    features: ["Cooling crystals for fresh breath", "Fights cavities and plaque", "Strengthens enamel", "Whitens teeth gradually", "Long-lasting freshness"],
    usage: ["Brush twice daily for 2 minutes each time", "Use a pea-sized amount on your toothbrush", "Brush in circular motions covering all surfaces", "Do not swallow. Rinse mouth after brushing"],
  },
  "water": {
    desc: "Purified drinking water processed through advanced filtration to ensure clean, safe, and great-tasting hydration for you and your family.",
    features: ["Triple purified water", "Safe and hygienic", "Great tasting hydration", "Convenient large bottle", "Essential daily need"],
    usage: ["Drink directly or pour into a glass", "Keep refrigerated for best taste", "Use within 24 hours after opening", "Perfect for daily hydration needs"],
  },
  "coffee": {
    desc: "Premium instant coffee made from carefully selected coffee beans, delivering a rich, aromatic, and full-bodied coffee experience in every cup.",
    features: ["Rich and aromatic blend", "Instant preparation", "Made from premium beans", "Smooth and full-bodied taste", "No brewing equipment needed"],
    usage: ["Add 1-2 teaspoons to a cup", "Pour hot water (not boiling) and stir well", "Add milk and sugar to taste", "Enjoy hot for the best flavor experience"],
  },
  "noodles": {
    desc: "Quick and delicious instant noodles that can be prepared in minutes. A convenient and tasty meal option for busy days.",
    features: ["Ready in 3-5 minutes", "Delicious savory flavor", "Convenient meal solution", "Perfect for quick lunches", "Affordable and filling"],
    usage: ["Boil 2 cups of water", "Add noodles and seasoning packet", "Cook for 3-5 minutes stirring occasionally", "Serve hot and enjoy immediately"],
  },
  "ketchup": {
    desc: "Rich and tangy tomato ketchup made from fresh, ripe tomatoes. A versatile condiment that adds flavor to every meal.",
    features: ["Made from fresh ripe tomatoes", "Rich and tangy flavor", "No artificial colors", "Perfect consistency", "Family-friendly favorite"],
    usage: ["Use as a dipping sauce for fries and snacks", "Add to burgers, sandwiches, and wraps", "Use as a base for sauces and marinades", "Refrigerate after opening for freshness"],
  },
  "juice": {
    desc: "Refreshing fruit juice made from real fruit extracts. Packed with natural vitamins and great taste for a healthy, energizing drink.",
    features: ["Made from real fruit extracts", "Rich in natural vitamins", "No artificial flavors", "Refreshing and energizing", "Great for the whole family"],
    usage: ["Shake well before serving", "Serve chilled or over ice", "Best enjoyed fresh after opening", "Refrigerate and consume within 2-3 days"],
  },
  "sanitizer": {
    desc: "Antibacterial hand sanitizer that effectively kills 99.9% of germs without water. Essential for maintaining hygiene on the go.",
    features: ["Kills 99.9% of germs", "No water required", "Quick-drying formula", "Moisturizing agents", "Travel-friendly size"],
    usage: ["Apply a coin-sized amount to palm", "Rub hands together covering all surfaces", "Let dry completely - do not rinse", "Use before meals and after touching surfaces"],
  },
  "cream": {
    desc: "Rich and creamy dairy cream perfect for cooking, baking, and adding a luxurious touch to your favorite dishes and desserts.",
    features: ["Rich and creamy texture", "Versatile cooking ingredient", "Perfect for desserts", "Enhances flavor of dishes", "Fresh dairy quality"],
    usage: ["Add to curries and soups for richness", "Whip for dessert toppings", "Use in baking for moist cakes", "Refrigerate after opening and use within days"],
  },
  "jam": {
    desc: "Delicious fruit jam made from a blend of real fruits, spread on bread, toast, and pastries for a sweet and fruity start to your day.",
    features: ["Made from real fruit pieces", "Sweet and fruity spread", "Perfect breakfast companion", "No artificial colors", "Great taste in every bite"],
    usage: ["Spread generously on bread or toast", "Use as a topping for pancakes and waffles", "Add to yogurt or oatmeal for extra flavor", "Reseal jar after each use"],
  },
  "biscuits": {
    desc: "Crispy, delicious biscuits baked to golden perfection. A perfect tea-time snack or anytime treat for the whole family.",
    features: ["Crispy and crunchy texture", "Delicious buttery flavor", "Perfectly baked", "Great with tea and coffee", "Family pack size"],
    usage: ["Enjoy with a cup of tea or coffee", "Perfect as an after-school snack", "Serve to guests with beverages", "Store in an airtight container to maintain crispness"],
  },
  "detergent": {
    desc: "Powerful laundry detergent with advanced stain removal technology. Cleans effectively while being gentle on fabrics and colors.",
    features: ["Advanced stain removal formula", "Gentle on fabrics and colors", "Fresh long-lasting fragrance", "Works in all water temperatures", "Economical - a little goes a long way"],
    usage: ["Add recommended amount to washing machine", "For hand washing, dissolve in water before adding clothes", "Use warm water for tough stains", "Follow garment care instructions"],
  },
  "chicken": {
    desc: "Fresh, halal chicken sourced from trusted farms. Cleaned, cut, and packed hygienically for safe and delicious meals.",
    features: ["100% halal certified", "Fresh from trusted farms", "Hygienically processed", "No antibiotics or hormones", "Various cuts available"],
    usage: ["Wash thoroughly before cooking", "Cook to an internal temperature of 75°C", "Use in curries, BBQ, biryani, and more", "Refrigerate and consume within 2 days"],
  },
  "beef": {
    desc: "Premium quality fresh beef, carefully selected and hygienically processed. Perfect for traditional Pakistani dishes and international cuisines.",
    features: ["Premium quality cuts", "Halal certified", "Fresh and hygienic", "Rich in protein and iron", "Tender and flavorful"],
    usage: ["Wash and marinate for tender results", "Slow cook for curries and nihari", "Grill for kebabs and steaks", "Refrigerate and consume within 2 days"],
  },
  "eggs": {
    desc: "Fresh farm eggs packed with protein and essential nutrients. A versatile ingredient for breakfast, baking, and everyday cooking.",
    features: ["Farm fresh quality", "Rich in protein", "Essential nutrients", "Versatile ingredient", "Hygienically packed"],
    usage: ["Boil for 8-10 minutes for hard-boiled eggs", "Fry or scramble for breakfast", "Use in baking and desserts", "Refrigerate for longer freshness"],
  },
  "apples": {
    desc: "Fresh, crispy apples handpicked for quality. Rich in fiber and natural sweetness, perfect for healthy snacking and cooking.",
    features: ["Fresh and crispy", "Naturally sweet", "Rich in fiber and vitamins", "No artificial coating", "Healthy snack option"],
    usage: ["Wash and eat fresh as a snack", "Slice for fruit salads and desserts", "Use in baking pies and cakes", "Store in refrigerator for extended freshness"],
  },
  "mangoes": {
    desc: "Sweet, juicy Pakistani mangoes known worldwide for their exceptional taste and aroma. The king of fruits, fresh from the orchards.",
    features: ["Naturally sweet and juicy", "Rich tropical aroma", "Export quality", "Handpicked for freshness", "Rich in vitamins A and C"],
    usage: ["Wash, peel, and eat fresh", "Blend into smoothies and milkshakes", "Use in desserts and fruit salads", "Store at room temperature until ripe, then refrigerate"],
  },
  "onions": {
    desc: "Fresh, high-quality onions essential for Pakistani cooking. Adds rich flavor and aroma to curries, salads, and every savory dish.",
    features: ["Fresh and pungent", "Essential cooking ingredient", "Adds flavor to every dish", "Long shelf life", "Carefully selected quality"],
    usage: ["Peel and chop as needed for cooking", "Sauté for curry base", "Slice thin for salads and garnishing", "Store in a cool, dry, well-ventilated place"],
  },
};

function generateProductDetails(name: string, category: string, weight: string) {
  const nameLower = name.toLowerCase();

  // Find matching knowledge entry
  for (const [key, value] of Object.entries(productKnowledge)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }

  // Category-based fallback
  const catLower = category.toLowerCase();
  if (catLower.includes("beverage") || catLower.includes("drink")) {
    return {
      desc: `Refreshing ${name} - a quality beverage perfect for quenching your thirst. Enjoy chilled for the best experience.`,
      features: ["Refreshing taste", "Quality ingredients", "Perfect for any occasion", "Best served chilled", weight ? `Convenient ${weight} size` : "Great value"],
      usage: ["Serve well chilled", "Pour into a glass over ice", "Enjoy with meals or as a standalone drink", "Refrigerate after opening"],
    };
  }
  if (catLower.includes("snack")) {
    return {
      desc: `Delicious ${name} - a tasty snack perfect for any time of day. Crispy, flavorful, and satisfying.`,
      features: ["Delicious taste", "Crispy and fresh", "Perfect snack size", "Great for sharing", "Quality ingredients"],
      usage: ["Enjoy straight from the pack", "Perfect for on-the-go snacking", "Great for parties and gatherings", "Store in a cool, dry place"],
    };
  }
  if (catLower.includes("dairy") || catLower.includes("egg")) {
    return {
      desc: `Fresh ${name} - a quality dairy product packed with essential nutrients. Perfect for daily nutrition needs.`,
      features: ["Fresh and natural", "Rich in nutrients", "Quality sourced", "Essential daily nutrition", "Family-friendly"],
      usage: ["Check expiry date before use", "Refrigerate after opening", "Use within recommended days", "Shake well if required"],
    };
  }
  if (catLower.includes("meat") || catLower.includes("fish")) {
    return {
      desc: `Fresh, halal ${name} sourced from trusted suppliers. Hygienically processed and packed for safe, delicious meals.`,
      features: ["Halal certified", "Fresh quality", "Hygienically processed", "Rich in protein", "No additives"],
      usage: ["Wash thoroughly before cooking", "Cook to recommended internal temperature", "Use in your favorite recipes", "Refrigerate and use within 2 days"],
    };
  }
  if (catLower.includes("cooking") || catLower.includes("essential")) {
    return {
      desc: `Premium quality ${name} - an essential kitchen staple for everyday cooking. Delivers consistent quality and great taste.`,
      features: ["Premium quality", "Kitchen essential", "Consistent results", "Value for money", "Hygienically packed"],
      usage: ["Use as directed in recipes", "Store in a cool, dry place", "Keep container sealed after use", "Check expiry date before use"],
    };
  }
  if (catLower.includes("personal") || catLower.includes("care")) {
    return {
      desc: `Quality ${name} for your personal care routine. Gentle, effective, and designed for everyday use.`,
      features: ["Gentle formula", "Effective results", "Dermatologically tested", "Daily use friendly", "Quality assured"],
      usage: ["Follow product instructions", "Use regularly for best results", "Store in a cool, dry place", "Keep out of reach of children"],
    };
  }
  if (catLower.includes("chinese") || catLower.includes("imported")) {
    return {
      desc: `Premium imported ${name} - authentic international quality for your kitchen. Adds unique flavors to your cooking.`,
      features: ["Authentic imported quality", "Unique international flavors", "Premium ingredients", "Versatile use", "Quality guaranteed"],
      usage: ["Use in Asian-inspired dishes", "Follow recipe guidelines for best results", "Store in a cool, dry place", "Check label for specific instructions"],
    };
  }

  // Generic fallback
  return {
    desc: `High-quality ${name} - a reliable product for your daily needs. Carefully sourced and packed for your satisfaction.`,
    features: ["Premium quality product", "Reliable and consistent", "Value for money", "Carefully sourced", "Satisfies your needs"],
    usage: ["Use as per your requirements", "Store in appropriate conditions", "Check label for specific instructions", "Best used before expiry date"],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { name, category, weight } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const details = generateProductDetails(name, category || "", weight || "");

    return NextResponse.json({
      description: details.desc,
      features: details.features,
      usage: details.usage,
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate product details" }, { status: 500 });
  }
}
