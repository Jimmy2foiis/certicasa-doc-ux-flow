
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddressInput } from "./AddressInput";
import { ApiStatus } from "./ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/googleMaps/useGoogleMapsAutocomplete";
import { GoogleMapsCoordinates } from "@/types/googleMaps";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, MapPin, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Component to test the Google Maps address autocomplete functionality
 */
export const AddressAutocompleteTest = () => {
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<GoogleMapsCoordinates | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Use the Google Maps autocomplete hook
  const { 
    isLoading, 
    error, 
    apiAvailable, 
    initAutocomplete 
  } = useGoogleMapsAutocomplete({
    inputRef,
    initialAddress: address,
    onAddressSelected: (address) => {
      console.log("Test component: Address selected:", address);
      setSelectedAddress(address);
      setTestStatus('success');
      toast({
        title: "Address Selected",
        description: "The autocomplete successfully selected an address",
      });
    },
    onCoordinatesSelected: (coords) => {
      console.log("Test component: Coordinates selected:", coords);
      setCoordinates(coords);
      toast({
        title: "Coordinates Retrieved",
        description: `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(6)}`,
      });
    }
  });

  // Initialize autocomplete when the test begins
  const handleStartTest = () => {
    setTestStatus('idle');
    setSelectedAddress(null);
    setCoordinates(null);
    
    if (inputRef.current) {
      inputRef.current.focus();
      
      try {
        initAutocomplete();
        toast({
          title: "Test Started",
          description: "Try typing an address and select from the suggestions",
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
        setTestStatus('error');
        toast({
          title: "Initialization Error",
          description: "Could not initialize Google Maps autocomplete",
          variant: "destructive",
        });
      }
    }
  };

  // Reset the test
  const handleReset = () => {
    setAddress("");
    setSelectedAddress(null);
    setCoordinates(null);
    setTestStatus('idle');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Google Maps Autocomplete Test</span>
          {testStatus === 'success' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check size={14} className="mr-1" /> Working
            </Badge>
          )}
          {testStatus === 'error' && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <X size={14} className="mr-1" /> Not Working
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Test the address autocomplete functionality directly in this form
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address-test" className="text-sm font-medium">Test Address Input</label>
          <AddressInput
            ref={inputRef}
            id="address-test"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            isLoading={isLoading}
            placeholder="Type an address to test autocomplete..."
          />
          
          <ApiStatus 
            isLoading={isLoading} 
            apiAvailable={apiAvailable} 
          />
          
          {error && (
            <div className="text-red-500 text-xs mt-1">{error}</div>
          )}
        </div>

        {selectedAddress && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Address:</h4>
              <div className="p-2 bg-muted rounded-md text-sm flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                <span>{selectedAddress}</span>
              </div>
            </div>
          </>
        )}
        
        {coordinates && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Coordinates:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted rounded-md text-sm">
                <span className="font-medium">Lat:</span> {coordinates.lat.toFixed(6)}
              </div>
              <div className="p-2 bg-muted rounded-md text-sm">
                <span className="font-medium">Lng:</span> {coordinates.lng.toFixed(6)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={!address && !selectedAddress}
        >
          Reset
        </Button>
        <Button 
          onClick={handleStartTest}
          disabled={!apiAvailable}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Test
        </Button>
      </CardFooter>
    </Card>
  );
};
