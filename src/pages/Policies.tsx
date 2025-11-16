import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Heart, Users, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

const Policies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchPolicies();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setCustomer(customerData);
    }
  };

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "Error",
        description: "Failed to load policies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'health': return Shield;
      case 'life': return Heart;
      case 'family': return Users;
      default: return Shield;
    }
  };

  const handleBuyClick = (policy: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase a policy",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setSelectedPolicy(policy);
    setShowPurchaseDialog(true);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !customer || !selectedPolicy) return;

    setPurchasing(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + selectedPolicy.term_years);

      const { error } = await supabase
        .from('policy_holders')
        .insert({
          customer_id: customer.id,
          policy_id: selectedPolicy.id,
          premium_amount: selectedPolicy.base_premium,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_frequency: 'annually',
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Purchase Successful!",
        description: "Your policy has been activated",
      });
      setShowPurchaseDialog(false);
      navigate('/dashboard/customer');
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase policy",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Available Policies</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            {user ? (
              <Button onClick={() => navigate('/dashboard/customer')}>
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Insurance Plan</h2>
          <p className="text-muted-foreground">
            Find the perfect insurance coverage for you and your family
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => {
            const Icon = getIcon(policy.type);
            return (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Icon className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-xl mb-2">{policy.name}</CardTitle>
                      <Badge variant="secondary" className="capitalize">
                        {policy.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Coverage Amount</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{policy.coverage_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Premium</p>
                      <p className="text-xl font-semibold">
                        ₹{policy.base_premium.toLocaleString()}/year
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Term</p>
                      <p className="font-medium">{policy.term_years} year{policy.term_years > 1 ? 's' : ''}</p>
                    </div>
                    {policy.description && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{policy.description}</p>
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      onClick={() => handleBuyClick(policy)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase {selectedPolicy?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePurchaseSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Policy Details</Label>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Coverage:</span>{" "}
                  ₹{selectedPolicy?.coverage_amount?.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Premium:</span>{" "}
                  ₹{selectedPolicy?.base_premium?.toLocaleString()}/year
                </p>
                <p className="text-sm">
                  <span className="font-medium">Term:</span>{" "}
                  {selectedPolicy?.term_years} year{selectedPolicy?.term_years > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPurchaseDialog(false)}
                className="flex-1"
                disabled={purchasing}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={purchasing}>
                {purchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Policies;