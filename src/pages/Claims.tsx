import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Claims = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    policyHolderId: "",
    claimAmount: "",
    incidentDescription: "",
    incidentDate: "",
    hospitalName: ""
  });

  const [claims, setClaims] = useState<any[]>([]);
  const [policyHolders, setPolicyHolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please login to view claims",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setUser(user);
    fetchData(user.id);
  };

  const fetchData = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setCustomer(customerData);

      if (customerData) {
        const { data: policyHoldersData } = await supabase
          .from('policy_holders')
          .select(`
            *,
            policies (*)
          `)
          .eq('customer_id', customerData.id)
          .eq('status', 'active');
        setPolicyHolders(policyHoldersData || []);

        const { data: claimsData } = await supabase
          .from('claims')
          .select('*')
          .eq('policy_holder_id', customerData.id)
          .order('created_at', { ascending: false });
        setClaims(claimsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('claims')
        .insert({
          policy_holder_id: formData.policyHolderId,
          claim_amount: parseFloat(formData.claimAmount),
          incident_date: formData.incidentDate,
          incident_description: formData.incidentDescription,
          hospital_name: formData.hospitalName,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully and is under review.",
      });
      
      setFormData({ 
        policyHolderId: "", 
        claimAmount: "", 
        incidentDescription: "", 
        incidentDate: "", 
        hospitalName: "" 
      });
      fetchData(user.id);
    } catch (error: any) {
      console.error('Claim submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit claim",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': 
        return 'bg-success text-success-foreground';
      case 'rejected': 
        return 'bg-destructive text-destructive-foreground';
      case 'processing': 
        return 'bg-warning text-warning-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default: 
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Insurance Claims</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>File a New Claim</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="policy">Select Policy</Label>
                  <Select
                    value={formData.policyHolderId}
                    onValueChange={(value) => setFormData({ ...formData, policyHolderId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policyHolders.map((ph) => (
                        <SelectItem key={ph.id} value={ph.id}>
                          {ph.policies?.name} - ₹{ph.policies?.coverage_amount?.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Claim Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter claim amount"
                    value={formData.claimAmount}
                    onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Incident Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital Name</Label>
                  <Input
                    id="hospital"
                    placeholder="Enter hospital name"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Incident Description</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the incident..."
                    value={formData.incidentDescription}
                    onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {claims.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No claims filed yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">
                            ₹{claim.claim_amount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(claim.incident_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {claim.incident_description}
                      </p>
                      {claim.hospital_name && (
                        <p className="text-sm">
                          <span className="font-medium">Hospital:</span> {claim.hospital_name}
                        </p>
                      )}
                      {claim.approved_amount && (
                        <p className="text-sm text-success">
                          <span className="font-medium">Approved Amount:</span> ₹{claim.approved_amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Claims;