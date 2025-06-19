
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAvoidedIngredients, saveAvoidedIngredients } from "@/utils/storage";

interface SettingsViewProps {
  onBack: () => void;
  onSettingsChanged: () => void;
}

const COMMON_INGREDIENTS = [
  'lök', 'vitlök', 'laktos', 'gluten', 'mjölk', 'ägg', 'nötter',
  'soja', 'fisk', 'skaldjur', 'sesam', 'selleri', 'senap',
  'fruktsocker', 'socker', 'aspartam', 'konserveringsmedel'
];

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onSettingsChanged }) => {
  const [avoidedIngredients, setAvoidedIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const ingredients = await getAvoidedIngredients();
      setAvoidedIngredients(ingredients);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda inställningar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await saveAvoidedIngredients(avoidedIngredients);
      onSettingsChanged();
      toast({
        title: "Sparat!",
        description: "Dina inställningar har sparats",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara inställningar",
        variant: "destructive",
      });
    }
  };

  const addIngredient = (ingredient: string) => {
    const trimmedIngredient = ingredient.trim().toLowerCase();
    if (trimmedIngredient && !avoidedIngredients.includes(trimmedIngredient)) {
      setAvoidedIngredients([...avoidedIngredients, trimmedIngredient]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setAvoidedIngredients(avoidedIngredients.filter(item => item !== ingredient));
  };

  const handleAddCustom = () => {
    if (newIngredient.trim()) {
      addIngredient(newIngredient);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar inställningar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Inställningar</h1>
        </div>

        {/* Add Custom Ingredient */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">Lägg till ingrediens att undvika</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="T.ex. jordnötter, citrus..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
              className="flex-1"
            />
            <Button onClick={handleAddCustom} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Common Ingredients */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">Vanliga ingredienser</h3>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_INGREDIENTS.map((ingredient) => (
              <Button
                key={ingredient}
                onClick={() => addIngredient(ingredient)}
                variant={avoidedIngredients.includes(ingredient) ? "default" : "outline"}
                size="sm"
                className={`justify-start ${
                  avoidedIngredients.includes(ingredient)
                    ? "bg-red-100 text-red-800 border-red-300"
                    : ""
                }`}
                disabled={avoidedIngredients.includes(ingredient)}
              >
                {ingredient}
              </Button>
            ))}
          </div>
        </Card>

        {/* Selected Ingredients */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">
            Du undviker ({avoidedIngredients.length})
          </h3>
          {avoidedIngredients.length === 0 ? (
            <p className="text-gray-500 text-sm">Inga ingredienser valda än</p>
          ) : (
            <div className="space-y-2">
              {avoidedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-red-50 p-2 rounded"
                >
                  <span className="text-red-800 font-medium">{ingredient}</span>
                  <Button
                    onClick={() => removeIngredient(ingredient)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Save Button */}
        <div className="space-y-4">
          <Button
            onClick={saveSettings}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Spara inställningar
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Tillbaka
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
