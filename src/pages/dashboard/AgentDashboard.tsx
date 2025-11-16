import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, MessageSquare, LogOut, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logoutUser } from "@/lib/auth";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agentName, setAgentName] = useState("");
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activePolicies: 0,
    pendingClaims: 0,
    openTickets: 0,
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
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'agent') {
      toast({
        title: "Access Denied",
        description: "Agent access required",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setAgentName(profile.email.split('@')[0]);
    fetchDashboardStats(user.id);
  };

  const fetchDashboardStats = async (userId: string) => {
    try {
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!agent) {
        toast({
          title: "Agent profile not found",
          description: "Please contact administrator",
          variant: "destructive",
        });
        return;
      }

      const [
        { count: customersCount },
        { count: policiesCount },
        { count: claimsCount },
        { count: ticketsCount }
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('agent_id', agent.id),
        supabase.from('policy_holders').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('support_queries').select('*', { count: 'exact', head: true }).eq('status', 'open')
      ]);

      setStats({
        totalCustomers: customersCount || 0,
        activePolicies: policiesCount || 0,
        pendingClaims: claimsCount || 0,
        openTickets: ticketsCount || 0,
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
              Agent Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, {agentName}!</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePolicies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingClaims}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openTickets}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Agent Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Manage your customers, review claims, and provide support
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate("/policies")}>
                      View Policies
                    </Button>
                    <Button onClick={() => navigate("/claims")} variant="outline">
                      Review Claims
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customers">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Customer management coming soon
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="claims">
                <div className="text-center py-8">
                  <Button onClick={() => navigate("/claims")}>
                    View All Claims
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="support">
                <div className="text-center py-8">
                  <Button onClick={() => navigate("/support")}>
                    View Support Tickets
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

export default AgentDashboard;
