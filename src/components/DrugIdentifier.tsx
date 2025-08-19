import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, AlertCircle, CheckCircle, Info, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DrugInfo {
  name: string;
  genericName: string;
  purpose: string[];
  contraindications: string[];
  dosage: string;
  sideEffects: string[];
  prescriptionRequired: boolean;
  activeIngredients: string[];
  warnings: string[];
}

export const DrugIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simulated drug database for demo
  const simulatedDrugData: DrugInfo = {
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    purpose: [
      "Pain relief (headaches, muscle aches, arthritis)",
      "Fever reduction",
      "Post-operative pain management"
    ],
    contraindications: [
      "Severe liver disease",
      "Alcohol dependency",
      "Allergy to acetaminophen",
      "Children under 2 years (without medical supervision)"
    ],
    dosage: "Adults: 500mg-1000mg every 4-6 hours. Maximum 4000mg per day.",
    sideEffects: [
      "Nausea (rare)",
      "Skin rash (allergic reaction)",
      "Liver damage (with overdose)"
    ],
    prescriptionRequired: false,
    activeIngredients: ["Acetaminophen 500mg"],
    warnings: [
      "Do not exceed recommended dose",
      "Avoid alcohol while taking this medication",
      "Consult doctor if symptoms persist"
    ]
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDrugInfo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      fileInputRef.current?.click();
    } else {
      toast({
        title: "Camera not available",
        description: "Your browser doesn't support camera access. Please upload an image instead.",
        variant: "destructive",
      });
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDrugInfo(simulatedDrugData);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: "Drug identified successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Pill className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MediScan
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Identify medications instantly and get comprehensive drug information including usage, contraindications, and prescription requirements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Image Upload Section */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Capture or Upload Medicine Image
              </CardTitle>
              <CardDescription>
                Take a clear photo of the medication or upload an existing image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Preview */}
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected medication"
                    className="w-full h-64 object-cover rounded-lg border-2 border-border"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null);
                      setDrugInfo(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Pill className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No image selected. Upload or capture a photo of your medication.
                  </p>
                </div>
              )}

              {/* Upload Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="medical"
                  onClick={handleCameraCapture}
                  className="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Analyze Button */}
              {selectedImage && (
                <Button
                  variant="hero"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Identify Medication
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Drug Information
              </CardTitle>
              <CardDescription>
                Comprehensive medication details and safety information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {drugInfo ? (
                <div className="space-y-6">
                  {/* Drug Name & Prescription Status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{drugInfo.name}</h3>
                      <p className="text-muted-foreground">Generic: {drugInfo.genericName}</p>
                    </div>
                    <Badge
                      variant={drugInfo.prescriptionRequired ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {drugInfo.prescriptionRequired ? "Prescription Required" : "Over-the-Counter"}
                    </Badge>
                  </div>

                  {/* Purpose */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      Medical Uses
                    </h4>
                    <ul className="space-y-1">
                      {drugInfo.purpose.map((use, index) => (
                        <li key={index} className="text-sm text-muted-foreground pl-6 relative">
                          <span className="absolute left-2 text-secondary">•</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contraindications */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Do NOT Use If
                    </h4>
                    <ul className="space-y-1">
                      {drugInfo.contraindications.map((contra, index) => (
                        <li key={index} className="text-sm text-muted-foreground pl-6 relative">
                          <span className="absolute left-2 text-destructive">•</span>
                          {contra}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dosage */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Dosage Instructions</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {drugInfo.dosage}
                    </p>
                  </div>

                  {/* Warnings */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      Important Warnings
                    </h4>
                    <ul className="space-y-1">
                      {drugInfo.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-muted-foreground pl-6 relative">
                          <span className="absolute left-2 text-warning">⚠</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                    <p className="text-xs text-muted-foreground">
                      <strong>Medical Disclaimer:</strong> This information is for educational purposes only. 
                      Always consult with a healthcare professional before taking any medication. 
                      Do not use this app as a substitute for professional medical advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload an image and click "Identify Medication" to get detailed drug information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Safety Notice */}
        <Card className="max-w-4xl mx-auto mt-8 border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-warning mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Important Safety Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• This tool is for informational purposes only and should not replace professional medical advice</li>
                  <li>• Always verify medication information with a healthcare provider or pharmacist</li>
                  <li>• Contact emergency services immediately if you experience severe adverse reactions</li>
                  <li>• Keep all medications out of reach of children</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};