import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, DollarSign, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-primary">HealthSure</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">My Dashboard</h2>

        {/* My Policies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Premium Health Shield", type: "Health", premium: "₹15,000", status: "Active" },
                { name: "Family Care Plus", type: "Family", premium: "₹25,000", status: "Active" }
              ].map((policy, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
                  <div className="flex items-center gap-4">
                    <Shield className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-semibold">{policy.name}</p>
                      <p className="text-sm text-muted-foreground">{policy.type} Insurance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{policy.premium}/year</p>
                    <p className="text-sm text-success">{policy.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={() => navigate('/policies')}>
              Browse All Policies
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/claims/new')}>
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

        {/* Recent Claims */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "CLM-1001", amount: "₹25,000", status: "Approved", date: "2024-11-10" },
                { id: "CLM-1002", amount: "₹15,000", status: "Under Review", date: "2024-11-14" }
              ].map((claim, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{claim.id}</p>
                    <p className="text-sm text-muted-foreground">{claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{claim.amount}</p>
                    <p className={`text-sm ${claim.status === 'Approved' ? 'text-success' : 'text-warning'}`}>
                      {claim.status}
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

export default CustomerDashboard;
