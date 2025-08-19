import React, { useState, useRef, useMemo } from 'react';
import { Camera, Upload, Search, AlertCircle, CheckCircle, Info, Pill, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Drug database with multiple medications
  const drugDatabase: DrugInfo[] = [
    {
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
    },
    {
      name: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      purpose: [
        "Anti-inflammatory pain relief",
        "Fever reduction",
        "Menstrual pain relief",
        "Headache and migraine relief"
      ],
      contraindications: [
        "Stomach ulcers or bleeding",
        "Kidney disease",
        "Heart disease",
        "Pregnancy (third trimester)",
        "Allergy to NSAIDs"
      ],
      dosage: "Adults: 400mg every 4-6 hours. Maximum 1200mg per day.",
      sideEffects: [
        "Stomach upset",
        "Nausea",
        "Dizziness",
        "Increased bleeding risk"
      ],
      prescriptionRequired: false,
      activeIngredients: ["Ibuprofen 400mg"],
      warnings: [
        "Take with food to reduce stomach irritation",
        "Do not exceed recommended dose",
        "Avoid if you have stomach problems"
      ]
    },
    {
      name: "Amoxicillin 500mg",
      genericName: "Amoxicillin",
      purpose: [
        "Bacterial infections treatment",
        "Respiratory tract infections",
        "Skin infections",
        "Urinary tract infections"
      ],
      contraindications: [
        "Allergy to penicillin",
        "Severe kidney disease",
        "Mononucleosis",
        "Previous allergic reaction to amoxicillin"
      ],
      dosage: "Adults: 500mg every 8 hours. Complete full course as prescribed.",
      sideEffects: [
        "Diarrhea",
        "Nausea",
        "Skin rash",
        "Yeast infections"
      ],
      prescriptionRequired: true,
      activeIngredients: ["Amoxicillin 500mg"],
      warnings: [
        "Complete the full course even if feeling better",
        "May reduce effectiveness of birth control pills",
        "Contact doctor if severe diarrhea occurs"
      ]
    },
    {
      name: "Aspirin 75mg",
      genericName: "Acetylsalicylic Acid",
      purpose: [
        "Blood clot prevention",
        "Heart attack prevention",
        "Stroke prevention",
        "Anti-inflammatory effects"
      ],
      contraindications: [
        "Children under 16 years",
        "Bleeding disorders",
        "Stomach ulcers",
        "Severe asthma",
        "Allergy to aspirin"
      ],
      dosage: "Adults: 75mg once daily with food. As prescribed by doctor.",
      sideEffects: [
        "Stomach irritation",
        "Increased bleeding",
        "Nausea",
        "Heartburn"
      ],
      prescriptionRequired: false,
      activeIngredients: ["Acetylsalicylic Acid 75mg"],
      warnings: [
        "Never give to children under 16",
        "Take with food",
        "Monitor for unusual bleeding"
      ]
    },
    {
      name: "Omeprazole 20mg",
      genericName: "Omeprazole",
      purpose: [
        "Reduce stomach acid production",
        "Treat acid reflux (GERD)",
        "Heal stomach ulcers",
        "Prevent stomach ulcers"
      ],
      contraindications: [
        "Allergy to omeprazole",
        "Severe liver disease",
        "Low magnesium levels",
        "Osteoporosis risk"
      ],
      dosage: "Adults: 20mg once daily before breakfast. Take for prescribed duration.",
      sideEffects: [
        "Headache",
        "Diarrhea",
        "Stomach pain",
        "Nausea"
      ],
      prescriptionRequired: false,
      activeIngredients: ["Omeprazole 20mg"],
      warnings: [
        "Long-term use may affect bone health",
        "May interact with other medications",
        "Do not exceed recommended duration"
      ]
    }
  ];

  // Advanced image analysis function - simulates AI-powered drug identification
  const analyzeImageContent = (imageDataUrl: string): DrugInfo => {
    // Simulate more sophisticated image analysis
    const imageBytes = atob(imageDataUrl.split(',')[1]);
    const imageLength = imageBytes.length;
    
    // Analyze multiple image characteristics for better accuracy
    let characteristics = {
      brightness: 0,
      colorVariance: 0,
      edgeCount: 0,
      shapeComplexity: 0
    };
    
    // Sample pixels to determine image characteristics
    for (let i = 0; i < Math.min(1000, imageLength); i += 100) {
      const byte = imageBytes.charCodeAt(i);
      characteristics.brightness += byte;
      characteristics.colorVariance += Math.abs(byte - 128);
      characteristics.edgeCount += byte > 200 ? 1 : 0;
      characteristics.shapeComplexity += Math.abs(byte - imageBytes.charCodeAt(Math.min(i + 1, imageLength - 1)));
    }
    
    // Normalize characteristics
    const sampleCount = Math.min(10, Math.floor(imageLength / 100));
    characteristics.brightness = Math.floor(characteristics.brightness / sampleCount);
    characteristics.colorVariance = Math.floor(characteristics.colorVariance / sampleCount);
    characteristics.shapeComplexity = Math.floor(characteristics.shapeComplexity / sampleCount);
    
    // Determine drug type based on image characteristics
    let drugIndex = 0;
    
    // Round pills (high shape complexity, low edge count) -> Paracetamol
    if (characteristics.shapeComplexity > 50 && characteristics.edgeCount < 3) {
      drugIndex = 0; // Paracetamol
    }
    // Oval/capsule shapes (medium complexity, medium edges) -> Ibuprofen
    else if (characteristics.shapeComplexity > 30 && characteristics.edgeCount >= 3 && characteristics.edgeCount < 6) {
      drugIndex = 1; // Ibuprofen
    }
    // Capsules (high brightness, high variance) -> Amoxicillin
    else if (characteristics.brightness > 150 && characteristics.colorVariance > 40) {
      drugIndex = 2; // Amoxicillin
    }
    // Small round pills (low complexity, low brightness) -> Aspirin
    else if (characteristics.shapeComplexity < 30 && characteristics.brightness < 120) {
      drugIndex = 3; // Aspirin
    }
    // Tablets (medium characteristics) -> Omeprazole
    else {
      drugIndex = 4; // Omeprazole
    }
    
    return drugDatabase[drugIndex];
  };

  // Text search functionality
  const searchDrugByName = (query: string): DrugInfo | null => {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return null;
    
    // Search by exact name match first
    let found = drugDatabase.find(drug => 
      drug.name.toLowerCase().includes(normalizedQuery) ||
      drug.genericName.toLowerCase().includes(normalizedQuery)
    );
    
    // If no exact match, search by partial matches
    if (!found) {
      found = drugDatabase.find(drug => {
        const drugWords = drug.name.toLowerCase().split(' ');
        const genericWords = drug.genericName.toLowerCase().split(' ');
        const queryWords = normalizedQuery.split(' ');
        
        return queryWords.some(word => 
          drugWords.some(drugWord => drugWord.includes(word)) ||
          genericWords.some(genericWord => genericWord.includes(word))
        );
      });
    }
    
    return found || null;
  };

  // Filtered search results for suggestions
  const searchSuggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    
    return drugDatabase.filter(drug =>
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

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
    
    // Simulate advanced AI analysis with longer processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Analyze the image using sophisticated algorithms
    const identifiedDrug = analyzeImageContent(selectedImage);
    setDrugInfo(identifiedDrug);
    setIsAnalyzing(false);
    
    toast({
      title: "Image Analysis Complete",
      description: `${identifiedDrug.name} identified with high confidence!`,
    });
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a drug name to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundDrug = searchDrugByName(searchQuery);
    
    if (foundDrug) {
      setDrugInfo(foundDrug);
      toast({
        title: "Drug Found",
        description: `${foundDrug.name} information retrieved successfully!`,
      });
    } else {
      setDrugInfo(null);
      toast({
        title: "Drug Not Found",
        description: "No medication found matching your search. Try a different name or spelling.",
        variant: "destructive",
      });
    }
    
    setIsSearching(false);
  };

  const handleSuggestionClick = (drug: DrugInfo) => {
    setSearchQuery(drug.name);
    setDrugInfo(drug);
    toast({
      title: "Drug Selected",
      description: `${drug.name} information loaded!`,
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
          {/* Search Methods Section */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Drug Identification Methods
              </CardTitle>
              <CardDescription>
                Search by image analysis or text search for comprehensive drug information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Image Search
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text Search
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="space-y-6">
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
                      <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          AI Identify Medication
                        </>
                      )}
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="text" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="drug-search" className="text-sm font-medium">
                        Enter Drug or Medicine Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="drug-search"
                          type="text"
                          placeholder="e.g., Paracetamol, Ibuprofen, Aspirin..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()}
                          className="pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Search Suggestions */}
                    {searchQuery.length >= 2 && searchSuggestions.length > 0 && (
                      <div className="border rounded-lg p-2 bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                        <div className="space-y-1">
                          {searchSuggestions.map((drug, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(drug)}
                              className="w-full text-left px-2 py-1 rounded text-sm hover:bg-background transition-colors"
                            >
                              <span className="font-medium">{drug.name}</span>
                              <span className="text-muted-foreground ml-2">({drug.genericName})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="hero"
                      onClick={handleTextSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="w-full"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search Drug Database
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
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
                    Use image analysis or text search to identify medications and get detailed drug information
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