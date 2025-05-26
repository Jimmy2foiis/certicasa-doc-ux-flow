
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Check, X } from 'lucide-react';
import { useBeetoolToken } from '@/hooks/useBeetoolToken';
import { useToast } from '@/components/ui/use-toast';

const BeetoolTokenInput = () => {
  const { beetoolToken, isTokenValid, saveToken, clearToken } = useBeetoolToken();
  const [inputToken, setInputToken] = useState(beetoolToken);
  const { toast } = useToast();

  const handleSaveToken = () => {
    if (inputToken.trim()) {
      saveToken(inputToken.trim());
      toast({
        title: "Token sauvegardé",
        description: "Le token Beetool a été sauvegardé avec succès",
      });
    }
  };

  const handleClearToken = () => {
    clearToken();
    setInputToken('');
    toast({
      title: "Token supprimé",
      description: "Le token Beetool a été supprimé",
      variant: "destructive"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration Token Beetool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="beetool-token">Token Beetool</Label>
          <div className="flex items-center gap-2">
            <Input
              id="beetool-token"
              type="password"
              placeholder="Saisissez votre token Beetool"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="flex-1"
            />
            {isTokenValid && (
              <Check className="h-5 w-5 text-green-500" />
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSaveToken} disabled={!inputToken.trim()}>
            Sauvegarder
          </Button>
          {isTokenValid && (
            <Button variant="outline" onClick={handleClearToken}>
              <X className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
        
        {isTokenValid && (
          <p className="text-sm text-green-600">
            ✓ Token configuré et prêt à être utilisé
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BeetoolTokenInput;
