import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Claims = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    policyId: "",
    claimAmount: "",
    reason: "",
    claimDate: ""
  });

  const [claims, setClaims] = useState([
    { id: "CLM-1001", policy: "Premium Health Shield", amount: 25000, status: "approved", date: "2024-11-10" },
    { id: "CLM-1002", policy: "Family Care Plus", amount: 15000, status: "under_review", date: "2024-11-14" },
    { id: "CLM-1003", policy: "Premium Health Shield", amount: 8000, status: "pending", date: "2024-11-15" }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const policyNames: Record<string, string> = {
      "1": "Premium Health Shield",
      "2": "Family Care Plus",
      "3": "Life Secure Pro"
    };

    const newClaim = {
      id: `CLM-${1004 + claims.length}`,
      policy: policyNames[formData.policyId] || "Unknown Policy",
      amount: parseInt(formData.claimAmount),
      status: "pending",
      date: formData.claimDate
    };

    setClaims([newClaim, ...claims]);
    
    toast({
      title: "Claim Submitted",
      description: "Your claim has been submitted successfully and is under review.",
    });
    setFormData({ policyId: "", claimAmount: "", reason: "", claimDate: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'under_review': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
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
            <h1 className="text-2xl font-bold text-primary">Claims Management</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* File New Claim */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File New Claim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="policy">Select Policy</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, policyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Premium Health Shield</SelectItem>
                      <SelectItem value="2">Family Care Plus</SelectItem>
                      <SelectItem value="3">Life Secure Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimAmount">Claim Amount (₹)</Label>
                  <Input
                    id="claimAmount"
                    type="number"
                    placeholder="25000"
                    value={formData.claimAmount}
                    onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimDate">Claim Date</Label>
                  <Input
                    id="claimDate"
                    type="date"
                    value={formData.claimDate}
                    onChange={(e) => setFormData({ ...formData, claimDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Claim</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the medical treatment or incident..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Documents</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload medical bills, reports, and prescriptions
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Claim
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Claims */}
          <Card>
            <CardHeader>
              <CardTitle>My Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{claim.id}</p>
                        <p className="text-sm text-muted-foreground">{claim.policy}</p>
                      </div>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold">₹{claim.amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-sm">{claim.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Claims;
