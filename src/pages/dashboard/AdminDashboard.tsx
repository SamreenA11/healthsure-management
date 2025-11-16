import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Shield, DollarSign, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Customers", value: "1,248", icon: Users, color: "text-primary" },
    { title: "Active Policies", value: "856", icon: Shield, color: "text-success" },
    { title: "Pending Claims", value: "23", icon: FileText, color: "text-warning" },
    { title: "Total Revenue", value: "₹45.2L", icon: DollarSign, color: "text-primary" }
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
            <h1 className="text-2xl font-bold text-primary">HealthSure Admin</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

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
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
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
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="w-full" onClick={() => navigate('/policies')}>
                <Shield className="h-4 w-4 mr-2" />
                Manage Policies
              </Button>
              <Button className="w-full" onClick={() => navigate('/claims')}>
                <FileText className="h-4 w-4 mr-2" />
                Review Claims
              </Button>
              <Button className="w-full" onClick={() => navigate('/users')}>
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold">Claim #{1000 + i}</p>
                      <p className="text-sm text-muted-foreground">Customer: John Doe</p>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold">Ticket #{5000 + i}</p>
                      <p className="text-sm text-muted-foreground">Policy inquiry</p>
                    </div>
                    <Button size="sm" variant="outline">Respond</Button>
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

export default AdminDashboard;
