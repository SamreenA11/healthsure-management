import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Heart, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Policies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem('role') || 'customer';
  
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    beneficiaryName: "",
    beneficiaryRelation: "",
    beneficiaryPhone: "",
    medicalHistory: "",
    existingConditions: "",
    emergencyContact: ""
  });

  const policies = [
    {
      id: 1,
      name: "Premium Health Shield",
      type: "health",
      icon: Shield,
      premium: 15000,
      coverage: 500000,
      duration: 1,
      features: [
        "Cashless hospitalization at 5000+ hospitals",
        "Pre and post hospitalization coverage",
        "Annual health checkup included",
        "No waiting period for accidents"
      ]
    },
    {
      id: 2,
      name: "Family Care Plus",
      type: "family",
      icon: Users,
      premium: 25000,
      coverage: 1000000,
      duration: 1,
      features: [
        "Covers up to 4 family members",
        "Maternity and newborn coverage",
        "Vaccination cover included",
        "Shared sum insured"
      ]
    },
    {
      id: 3,
      name: "Life Secure Pro",
      type: "life",
      icon: Heart,
      premium: 12000,
      coverage: 5000000,
      duration: 20,
      features: [
        "High death benefit coverage",
        "Tax benefits under Section 80C",
        "Nominee protection",
        "Long term coverage"
      ]
    },
    {
      id: 4,
      name: "Senior Citizen Health",
      type: "health",
      icon: Shield,
      premium: 20000,
      coverage: 300000,
      duration: 1,
      features: [
        "Specialized for age 60+",
        "Pre-existing disease coverage",
        "OPD benefits included",
        "Home healthcare support"
      ]
    }
  ];

  const handleBuyClick = (policy: any) => {
    setSelectedPolicy(policy);
    setShowPurchaseDialog(true);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingPolicies = JSON.parse(localStorage.getItem('myPolicies') || '[]');
    
    const newPolicyHolder = {
      id: Date.now(),
      policyId: selectedPolicy.id,
      policyName: selectedPolicy.name,
      type: selectedPolicy.type,
      premium: selectedPolicy.premium,
      coverage: selectedPolicy.coverage,
      status: "Active",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      beneficiaryName: purchaseForm.beneficiaryName,
      beneficiaryRelation: purchaseForm.beneficiaryRelation,
      beneficiaryPhone: purchaseForm.beneficiaryPhone,
      medicalHistory: purchaseForm.medicalHistory,
      existingConditions: purchaseForm.existingConditions,
      emergencyContact: purchaseForm.emergencyContact
    };
    
    existingPolicies.push(newPolicyHolder);
    localStorage.setItem('myPolicies', JSON.stringify(existingPolicies));
    
    toast({
      title: "Policy Purchased Successfully!",
      description: `${selectedPolicy.name} has been added to your account. Check "My Policies" in your dashboard.`,
    });
    
    setPurchaseForm({
      beneficiaryName: "",
      beneficiaryRelation: "",
      beneficiaryPhone: "",
      medicalHistory: "",
      existingConditions: "",
      emergencyContact: ""
    });
    setShowPurchaseDialog(false);
    setSelectedPolicy(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'bg-primary text-primary-foreground';
      case 'family': return 'bg-success text-success-foreground';
      case 'life': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isPolicyPurchased = (policyId: number) => {
    const myPolicies = JSON.parse(localStorage.getItem('myPolicies') || '[]');
    return myPolicies.some((p: any) => p.policyId === policyId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">HealthSure Policies</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Browse Our Policies</h2>
          <p className="text-muted-foreground">
            Choose the perfect insurance plan for you and your family
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary-light">
                      <policy.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{policy.name}</CardTitle>
                      <Badge className={`mt-2 ${getTypeColor(policy.type)}`}>
                        {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{policy.premium.toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted-foreground">
                      /{policy.duration} {policy.duration === 1 ? 'year' : 'years'}
                    </span>
                  </div>

                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Coverage Amount</p>
                    <p className="text-xl font-semibold">
                      ₹{policy.coverage.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Key Features:</p>
                    <ul className="space-y-2">
                      {policy.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full mt-4"
                    onClick={() => handleBuyClick(policy)}
                    disabled={isPolicyPurchased(policy.id)}
                  >
                    {isPolicyPurchased(policy.id) 
                      ? 'Already Purchased' 
                      : userRole === 'customer' ? 'Buy Now' : 'Assign to Customer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase {selectedPolicy?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePurchaseSubmit} className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                <Input
                  id="beneficiaryName"
                  placeholder="Full Name"
                  value={purchaseForm.beneficiaryName}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, beneficiaryName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiaryRelation">Relation *</Label>
                <Input
                  id="beneficiaryRelation"
                  placeholder="e.g., Spouse, Parent"
                  value={purchaseForm.beneficiaryRelation}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, beneficiaryRelation: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryPhone">Beneficiary Phone *</Label>
              <Input
                id="beneficiaryPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={purchaseForm.beneficiaryPhone}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, beneficiaryPhone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact *</Label>
              <Input
                id="emergencyContact"
                type="tel"
                placeholder="+91 98765 43210"
                value={purchaseForm.emergencyContact}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, emergencyContact: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Any previous surgeries, hospitalizations, or ongoing treatments..."
                value={purchaseForm.medicalHistory}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, medicalHistory: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingConditions">Existing Medical Conditions</Label>
              <Textarea
                id="existingConditions"
                placeholder="Diabetes, Hypertension, Asthma, etc."
                value={purchaseForm.existingConditions}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, existingConditions: e.target.value })}
                rows={3}
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Policy Summary</p>
              <div className="space-y-1 text-sm">
                <p>Premium: ₹{selectedPolicy?.premium.toLocaleString('en-IN')}/year</p>
                <p>Coverage: ₹{selectedPolicy?.coverage.toLocaleString('en-IN')}</p>
                <p>Duration: {selectedPolicy?.duration} {selectedPolicy?.duration === 1 ? 'year' : 'years'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowPurchaseDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Confirm Purchase
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Policies;
