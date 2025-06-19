
import React, { useState } from 'react';
import { ArrowLeft, Camera, Search, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { searchProduct } from "@/utils/foodApi";
import { scanBarcode } from "@/utils/cameraUtils";

interface ScannerViewProps {
  onBack: () => void;
  onScanSuccess: (result: any) => void;
  onScanError: (error: string) => void;
  avoidedIngredients: string[];
}

const ScannerView: React.FC<ScannerViewProps> = ({
  onBack,
  onScanSuccess,
  onScanError,
  avoidedIngredients
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  const handleManualSearch = async () => {
    if (!manualBarcode.trim()) {
      onScanError("Ange en streckkod");
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchProduct(manualBarcode.trim(), avoidedIngredients);
      onScanSuccess(result);
    } catch (error) {
      console.error('Search error:', error);
      onScanError("Kunde inte hitta produkten. Kontrollera streckkoden.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraScan = async () => {
    setIsLoading(true);
    
    try {
      const barcode = await scanBarcode();
      const result = await searchProduct(barcode, avoidedIngredients);
      onScanSuccess(result);
    } catch (error) {
      console.error('Scan error:', error);
      onScanError("Kunde inte skanna produkten. Försök igen eller ange streckkoden manuellt.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Skanna Produkt</h1>
        </div>

        {/* Camera Scanner */}
        <Card className="p-6 mb-6 text-center">
          <div className="bg-gray-200 h-64 rounded-lg mb-4 flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
                <p className="text-gray-600">Skannar...</p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tryck för att öppna kameran</p>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleCameraScan}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Skannar...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Öppna kamera
              </>
            )}
          </Button>
        </Card>

        {/* Manual Input */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Eller ange streckkod manuellt</h3>
          <div className="space-y-3">
            <Input
              placeholder="Ange 13-siffrig EAN-kod..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
            />
            <Button
              onClick={handleManualSearch}
              disabled={isLoading || !manualBarcode.trim()}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Söker...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Sök produkt
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 Tips: Streckkoden finns oftast på baksidan av förpackningen
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScannerView;
