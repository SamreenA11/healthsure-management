import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, DollarSign, TrendingUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "My Customers", value: "42", icon: Users },
    { title: "Active Policies", value: "38", icon: Shield },
    { title: "This Month Commission", value: "₹28,500", icon: DollarSign },
    { title: "Growth", value: "+12%", icon: TrendingUp }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">HealthSure Agent</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Agent Dashboard</h2>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className="h-12 w-12 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button className="w-full" onClick={() => navigate('/customers/new')}>
                <Users className="h-4 w-4 mr-2" />
                Register New Customer
              </Button>
              <Button className="w-full" onClick={() => navigate('/policies')}>
                <Shield className="h-4 w-4 mr-2" />
                Assign Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Customers */}
        <Card>
          <CardHeader>
            <CardTitle>My Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rajesh Kumar", policy: "Premium Health Shield", status: "Active" },
                { name: "Priya Sharma", policy: "Family Care Plus", status: "Active" },
                { name: "Amit Patel", policy: "Life Secure Pro", status: "Pending" }
              ].map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.policy}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${customer.status === 'Active' ? 'text-success' : 'text-warning'}`}>
                      {customer.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;
