import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, CreditCard, LogOut, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logoutUser } from "@/lib/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAgents: 0,
    totalPolicies: 0,
    activeClaims: 0,
    pendingClaims: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchDashboardStats();
  };

  const fetchDashboardStats = async () => {
    try {
      const [
        { count: customersCount },
        { count: agentsCount },
        { count: policiesCount },
        { count: activeClaimsCount },
        { count: pendingClaimsCount },
        { data: payments }
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('agents').select('*', { count: 'exact', head: true }),
        supabase.from('policies').select('*', { count: 'exact', head: true }),
        supabase.from('claims').select('*', { count: 'exact', head: true }).neq('status', 'rejected').neq('status', 'approved'),
        supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('payments').select('amount').eq('status', 'completed')
      ]);

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalCustomers: customersCount || 0,
        totalAgents: agentsCount || 0,
        totalPolicies: policiesCount || 0,
        activeClaims: activeClaimsCount || 0,
        pendingClaims: pendingClaimsCount || 0,
        totalRevenue,
      });
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
      toast({ title: "Logged out successfully" });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage your insurance platform</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPolicies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeClaims}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingClaims} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Welcome to Admin Dashboard</h3>
                  <p className="text-muted-foreground">
                    Use the tabs above to manage policies, users, claims, and payments
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={() => navigate("/policies")}>
                      Manage Policies
                    </Button>
                    <Button onClick={() => navigate("/claims")} variant="outline">
                      Review Claims
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="policies">
                <div className="text-center py-8">
                  <Button onClick={() => navigate("/policies")}>
                    View All Policies
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    User management coming soon
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="claims">
                <div className="text-center py-8">
                  <Button onClick={() => navigate("/claims")}>
                    Manage Claims
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="payments">
                <div className="text-center py-8">
                  <Button onClick={() => navigate("/payments")}>
                    View Payments
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
