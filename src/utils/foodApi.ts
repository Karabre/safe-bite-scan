
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

export interface ProductSearchResult {
  product: any;
  isSafe: boolean;
  foundIngredients: string[];
  barcode: string;
}

export const searchProduct = async (barcode: string, avoidedIngredients: string[]): Promise<ProductSearchResult> => {
  try {
    console.log(`Searching for product with barcode: ${barcode}`);
    
    const response = await fetch(`${OPEN_FOOD_FACTS_API}/${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.product) {
      throw new Error('Product not found in database');
    }

    const product = data.product;
    console.log('Product found:', product.product_name);
    
    // Check ingredients
    const foundIngredients = checkIngredients(product, avoidedIngredients);
    const isSafe = foundIngredients.length === 0;
    
    console.log('Ingredient check result:', { isSafe, foundIngredients });
    
    return {
      product,
      isSafe,
      foundIngredients,
      barcode
    };
    
  } catch (error) {
    console.error('Error searching product:', error);
    throw error;
  }
};

const checkIngredients = (product: any, avoidedIngredients: string[]): string[] => {
  const foundIngredients: string[] = [];
  
  if (!avoidedIngredients.length) {
    return foundIngredients;
  }
  
  // Check ingredients text
  const ingredientsText = (product.ingredients_text || '').toLowerCase();
  console.log('Ingredients text:', ingredientsText);
  
  // Check each avoided ingredient
  avoidedIngredients.forEach(avoided => {
    const normalizedAvoided = avoided.toLowerCase().trim();
    
    // Simple text matching - can be improved with more sophisticated matching
    if (ingredientsText.includes(normalizedAvoided)) {
      foundIngredients.push(avoided);
    }
    
    // Also check individual ingredient objects if available
    if (product.ingredients && Array.isArray(product.ingredients)) {
      product.ingredients.forEach((ingredient: any) => {
        const ingredientText = (ingredient.text || ingredient.id || '').toLowerCase();
        if (ingredientText.includes(normalizedAvoided)) {
          if (!foundIngredients.includes(avoided)) {
            foundIngredients.push(avoided);
          }
        }
      });
    }
    
    // Check allergens
    if (product.allergens && product.allergens.toLowerCase().includes(normalizedAvoided)) {
      if (!foundIngredients.includes(avoided)) {
        foundIngredients.push(avoided);
      }
    }
    
    // Check traces
    if (product.traces && product.traces.toLowerCase().includes(normalizedAvoided)) {
      if (!foundIngredients.includes(avoided)) {
        foundIngredients.push(avoided);
      }
    }
  });
  
  console.log('Found avoided ingredients:', foundIngredients);
  return foundIngredients;
};

// Helper function to normalize ingredient names for better matching
const normalizeIngredientName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};
