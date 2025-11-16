import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, DollarSign, MessageSquare, LogOut, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/config/api";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myPolicies, setMyPolicies] = useState<any[]>([]);
  const [myClaims, setMyClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      toast({
        title: "Not logged in",
        description: "Please login to view your dashboard",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer's purchased policies
      const policiesData = await apiClient.get(`/api/policies/customer/${userId}`);
      setMyPolicies(policiesData || []);
      
      // Get customer ID first
      const customerData = await apiClient.get(`/api/customers/user/${userId}`);
      if (customerData?.customer_id) {
        // Fetch customer's claims
        const claimsData = await apiClient.get(`/api/claims/customer/${customerData.customer_id}`);
        setMyClaims(claimsData || []);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-success';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'under_review': return 'bg-warning text-warning-foreground';
      default: return 'text-muted-foreground';
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
              <p className="text-sm text-muted-foreground">Welcome back!</p>
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
                  <p className="text-3xl font-bold mt-2">{myPolicies.length}</p>
                </div>
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-3xl font-bold mt-2">{myClaims.length}</p>
                </div>
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                  <p className="text-3xl font-bold mt-2">
                    {myClaims.filter(c => c.status === 'pending' || c.status === 'under_review').length}
                  </p>
                </div>
                <FileText className="h-12 w-12 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/policies')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy New Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Policies</CardTitle>
              <Button variant="outline" onClick={() => navigate('/policies')}>
                Browse All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myPolicies.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't purchased any policies yet</p>
                <Button onClick={() => navigate('/policies')}>
                  Browse Policies
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myPolicies.map((policy) => (
                  <div key={policy.purchased_policy_id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-lg">{policy.name || policy.policy_name}</p>
                          <Badge className="bg-success text-success-foreground">
                            {policy.status || 'Active'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">{policy.type} Insurance</p>
                        <p className="text-sm text-muted-foreground">
                          Valid: {new Date(policy.start_date).toLocaleDateString()} to {new Date(policy.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{(policy.premium_amount || policy.premium)?.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-muted-foreground">per year</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm border-t pt-3">
                      <div>
                        <p className="text-muted-foreground">Coverage Amount</p>
                        <p className="font-semibold">₹{(policy.sum_insured || policy.coverage_amount)?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Beneficiary</p>
                        <p className="font-semibold">{policy.beneficiaryName} ({policy.beneficiaryRelation})</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => navigate('/claims')}>
                        File Claim
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate('/payments')}>
                        Make Payment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/claims')}>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">File a Claim</h3>
              <p className="text-sm text-muted-foreground">Submit a new claim request</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/payments')}>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Make Payment</h3>
              <p className="text-sm text-muted-foreground">Pay your premium</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/support')}>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Get Support</h3>
              <p className="text-sm text-muted-foreground">Raise a support ticket</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Claims</CardTitle>
              <Button variant="outline" onClick={() => navigate('/claims')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myClaims.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No claims filed yet</p>
                <Button onClick={() => navigate('/claims')}>
                  File a Claim
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myClaims.slice(0, 5).map((claim) => (
                  <div key={claim.id} className="p-4 bg-muted rounded-lg flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{claim.id}</p>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{claim.policy}</p>
                      <p className="text-sm mt-1">Amount: ₹{claim.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{claim.date}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
