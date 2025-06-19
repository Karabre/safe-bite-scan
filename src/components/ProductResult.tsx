
import React from 'react';
import { ArrowLeft, Camera, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductResultProps {
  result: {
    product: any;
    isSafe: boolean;
    foundIngredients: string[];
    barcode: string;
  };
  onBack: () => void;
  onScanAgain: () => void;
}

const ProductResult: React.FC<ProductResultProps> = ({
  result,
  onBack,
  onScanAgain
}) => {
  const { product, isSafe, foundIngredients, barcode } = result;

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
          <h1 className="text-2xl font-bold text-gray-800">Resultat</h1>
        </div>

        {/* Result Status */}
        <Card className={`p-6 mb-6 text-center ${
          isSafe 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="mb-4">
            {isSafe ? (
              <Shield className="h-16 w-16 text-green-600 mx-auto" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto" />
            )}
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${
            isSafe ? 'text-green-800' : 'text-red-800'
          }`}>
            {isSafe ? '🟢 SÄKER ATT ÄTA' : '🔴 UNDVIK DENNA PRODUKT'}
          </h2>
          
          <p className={`text-lg ${
            isSafe ? 'text-green-700' : 'text-red-700'
          }`}>
            {isSafe 
              ? 'Inga problem hittades med denna produkt'
              : `Innehåller ${foundIngredients.length} ingrediens${foundIngredients.length > 1 ? 'er' : ''} att undvika`
            }
          </p>
        </Card>

        {/* Product Info */}
        {product && (
          <Card className="p-4 mb-4">
            <div className="flex space-x-4">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {product.product_name || 'Okänd produkt'}
                </h3>
                {product.brands && (
                  <p className="text-gray-600 text-sm">{product.brands}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Streckkod: {barcode}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Found Ingredients */}
        {!isSafe && foundIngredients.length > 0 && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Ingredienser att undvika som hittades:
            </h3>
            <div className="space-y-2">
              {foundIngredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="bg-red-200 text-red-800 mr-2 mb-2"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Ingredients List */}
        {product?.ingredients_text && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-2">Fullständig ingredienslista:</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.ingredients_text}
            </p>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onScanAgain}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Skanna nästa produkt
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Tillbaka till start
          </Button>

          {product?.url && (
            <Button
              onClick={() => window.open(product.url, '_blank')}
              variant="ghost"
              className="w-full text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visa på Open Food Facts
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductResult;
