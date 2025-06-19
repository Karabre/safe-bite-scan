
import React, { useState, useEffect } from 'react';
import { Camera, Settings, Shield, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScannerView from "@/components/ScannerView";
import SettingsView from "@/components/SettingsView";
import ProductResult from "@/components/ProductResult";
import { useToast } from "@/hooks/use-toast";
import { getAvoidedIngredients } from "@/utils/storage";

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [avoidedIngredients, setAvoidedIngredients] = useState<string[]>([]);
  const [lastScanResult, setLastScanResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAvoidedIngredients();
  }, []);

  const loadAvoidedIngredients = async () => {
    try {
      const ingredients = await getAvoidedIngredients();
      setAvoidedIngredients(ingredients);
    } catch (error) {
      console.error('Error loading avoided ingredients:', error);
    }
  };

  const handleScanSuccess = (result: any) => {
    setLastScanResult(result);
    setCurrentView('result');
  };

  const handleScanError = (error: string) => {
    toast({
      title: "Skanningsfel",
      description: error,
      variant: "destructive",
    });
  };

  if (currentView === 'scanner') {
    return (
      <ScannerView
        onBack={() => setCurrentView('home')}
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        avoidedIngredients={avoidedIngredients}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <SettingsView
        onBack={() => setCurrentView('home')}
        onSettingsChanged={loadAvoidedIngredients}
      />
    );
  }

  if (currentView === 'result' && lastScanResult) {
    return (
      <ProductResult
        result={lastScanResult}
        onBack={() => setCurrentView('home')}
        onScanAgain={() => setCurrentView('scanner')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-green-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">SafeEat</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Skanna produkter och få omedelbar feedback baserat på dina kostbehov
          </p>
        </div>

        {/* Avoided Ingredients Summary */}
        {avoidedIngredients.length > 0 && (
          <Card className="p-4 mb-6 bg-orange-50 border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Du undviker ({avoidedIngredients.length})
            </h3>
            <div className="flex flex-wrap gap-1">
              {avoidedIngredients.slice(0, 5).map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs"
                >
                  {ingredient}
                </span>
              ))}
              {avoidedIngredients.length > 5 && (
                <span className="text-orange-600 text-xs px-2 py-1">
                  +{avoidedIngredients.length - 5} fler
                </span>
              )}
            </div>
          </Card>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          <Button
            onClick={() => setCurrentView('scanner')}
            className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-3"
            disabled={avoidedIngredients.length === 0}
          >
            <Camera className="h-6 w-6" />
            <span>Skanna Produkt</span>
          </Button>

          {avoidedIngredients.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Ställ in vilka ingredienser du vill undvika först
            </p>
          )}

          <Button
            onClick={() => setCurrentView('settings')}
            variant="outline"
            className="w-full h-12 text-lg flex items-center justify-center space-x-3"
          >
            <Settings className="h-5 w-5" />
            <span>Inställningar</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Säkra</p>
            <p className="text-xl font-bold text-green-600">0</p>
          </Card>
          <Card className="p-4 text-center">
            <X className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Undvik</p>
            <p className="text-xl font-bold text-red-600">0</p>
          </Card>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by Open Food Facts API
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
