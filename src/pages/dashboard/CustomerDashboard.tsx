import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, DollarSign, MessageSquare, LogOut, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myPolicies, setMyPolicies] = useState<any[]>([]);
  const [myClaims, setMyClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        description: "Please login to view your dashboard",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setUser(user);
    fetchDashboardData(user.id);
  };

  const fetchDashboardData = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setCustomer(customerData);

      if (customerData) {
        const { data: policiesData } = await supabase
          .from('policy_holders')
          .select(`
            *,
            policies (*)
          `)
          .eq('customer_id', customerData.id);
        setMyPolicies(policiesData || []);

        // Get claims for all customer's policies
        const policyHolderIds = policiesData?.map(ph => ph.id) || [];
        let claimsData: any[] = [];
        if (policyHolderIds.length > 0) {
          const { data } = await supabase
            .from('claims')
            .select('*')
            .in('policy_holder_id', policyHolderIds)
            .order('created_at', { ascending: false });
          claimsData = data || [];
        }
        setMyClaims(claimsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'processing':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Customer Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {customer?.full_name || 'Customer'}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                  <p className="text-3xl font-bold text-primary">{myPolicies.filter(p => p.status === 'active').length}</p>
                </div>
                <Shield className="h-8 w-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-3xl font-bold text-primary">{myClaims.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Claims</p>
                  <p className="text-3xl font-bold text-success">{myClaims.filter(c => c.status === 'approved').length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                  <p className="text-3xl font-bold text-warning">{myClaims.filter(c => c.status === 'pending').length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-warning opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Policies</CardTitle>
              <Button size="sm" onClick={() => navigate('/policies')}>
                <Plus className="h-4 w-4 mr-2" />
                Buy New
              </Button>
            </CardHeader>
            <CardContent>
              {myPolicies.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">No policies yet</p>
                  <Button onClick={() => navigate('/policies')}>Browse Policies</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPolicies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{policy.policies?.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {policy.policies?.type} Insurance
                          </p>
                        </div>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-medium">₹{policy.policies?.coverage_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Premium</p>
                          <p className="font-medium">₹{policy.premium_amount?.toLocaleString()}/year</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Claims</CardTitle>
              <Button size="sm" onClick={() => navigate('/claims/new')}>
                <Plus className="h-4 w-4 mr-2" />
                File Claim
              </Button>
            </CardHeader>
            <CardContent>
              {myClaims.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">No claims filed yet</p>
                  <Button onClick={() => navigate('/claims/new')}>File a Claim</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myClaims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">₹{claim.claim_amount?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(claim.claim_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {claim.incident_description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Button onClick={() => navigate('/policies')} className="h-20">
            <Shield className="h-6 w-6 mr-3" />
            View All Policies
          </Button>
          <Button onClick={() => navigate('/claims')} variant="outline" className="h-20">
            <FileText className="h-6 w-6 mr-3" />
            Manage Claims
          </Button>
          <Button onClick={() => navigate('/support')} variant="outline" className="h-20">
            <MessageSquare className="h-6 w-6 mr-3" />
            Get Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;