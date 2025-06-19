
import { Preferences } from '@capacitor/preferences';

const AVOIDED_INGREDIENTS_KEY = 'avoided_ingredients';

export const getAvoidedIngredients = async (): Promise<string[]> => {
  try {
    const result = await Preferences.get({ key: AVOIDED_INGREDIENTS_KEY });
    if (result.value) {
      return JSON.parse(result.value);
    }
    return [];
  } catch (error) {
    console.error('Error getting avoided ingredients:', error);
    return [];
  }
};

export const saveAvoidedIngredients = async (ingredients: string[]): Promise<void> => {
  try {
    await Preferences.set({
      key: AVOIDED_INGREDIENTS_KEY,
      value: JSON.stringify(ingredients)
    });
  } catch (error) {
    console.error('Error saving avoided ingredients:', error);
    throw error;
  }
};

export const addAvoidedIngredient = async (ingredient: string): Promise<void> => {
  const currentIngredients = await getAvoidedIngredients();
  const normalizedIngredient = ingredient.trim().toLowerCase();
  
  if (!currentIngredients.includes(normalizedIngredient)) {
    currentIngredients.push(normalizedIngredient);
    await saveAvoidedIngredients(currentIngredients);
  }
};

export const removeAvoidedIngredient = async (ingredient: string): Promise<void> => {
  const currentIngredients = await getAvoidedIngredients();
  const updatedIngredients = currentIngredients.filter(item => item !== ingredient);
  await saveAvoidedIngredients(updatedIngredients);
};
