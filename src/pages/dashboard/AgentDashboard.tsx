import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, UserPlus, FileText, MessageSquare, LogOut, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [customers, setCustomers] = useState([
    { id: 1, name: "Amit Kumar", email: "amit@example.com", phone: "+91 98765 43210", policies: 2 },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43211", policies: 1 }
  ]);

  const [claims, setClaims] = useState([
    { id: "CLM-1001", customer: "Amit Kumar", policy: "Premium Health Shield", amount: 25000, status: "pending", date: "2024-11-15" },
    { id: "CLM-1002", customer: "Priya Sharma", policy: "Family Care Plus", amount: 15000, status: "pending", date: "2024-11-14" }
  ]);

  const [supportQueries, setSupportQueries] = useState([
    { id: "SUP-001", customer: "Amit Kumar", subject: "Policy Coverage Query", status: "open", date: "2024-11-15" },
    { id: "SUP-002", customer: "Priya Sharma", subject: "Claim Status", status: "open", date: "2024-11-14" }
  ]);

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      ...customerForm,
      policies: 0
    };
    setCustomers([newCustomer, ...customers]);
    toast({
      title: "Customer Registered",
      description: `${customerForm.name} has been successfully registered.`
    });
    setCustomerForm({ name: "", email: "", phone: "", address: "" });
  };

  const handleApproveClaim = (claimId: string) => {
    setClaims(claims.map(claim => 
      claim.id === claimId ? { ...claim, status: "approved" } : claim
    ));
    toast({
      title: "Claim Approved",
      description: `Claim ${claimId} has been approved.`
    });
  };

  const handleRejectClaim = (claimId: string) => {
    setClaims(claims.map(claim => 
      claim.id === claimId ? { ...claim, status: "rejected" } : claim
    ));
    toast({
      title: "Claim Rejected",
      description: `Claim ${claimId} has been rejected.`
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'open': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Agent Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage customers and claims</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Customers</p>
                  <p className="text-3xl font-bold mt-2">{customers.length}</p>
                </div>
                <Users className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                  <p className="text-3xl font-bold mt-2">
                    {claims.filter(c => c.status === 'pending').length}
                  </p>
                </div>
                <FileText className="h-12 w-12 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Queries</p>
                  <p className="text-3xl font-bold mt-2">
                    {supportQueries.filter(q => q.status === 'open').length}
                  </p>
                </div>
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Button className="w-full" onClick={() => navigate('/policies')}>
                  View Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Register Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Register New Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterCustomer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Customer Name"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Customer Address"
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register Customer
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {customers.map((customer) => (
                  <div key={customer.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      </div>
                      <Badge>{customer.policies} Policies</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => navigate('/policies')}
                    >
                      Assign Policy
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claims Management */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claims.filter(c => c.status === 'pending').map((claim) => (
                <div key={claim.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{claim.id}</p>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{claim.customer}</p>
                      <p className="text-sm text-muted-foreground">{claim.policy}</p>
                      <p className="text-sm mt-1">Amount: ₹{claim.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{claim.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApproveClaim(claim.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleRejectClaim(claim.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Queries */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportQueries.map((query) => (
                <div key={query.id} className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{query.id}</p>
                      <Badge className={getStatusColor(query.status)}>
                        {query.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{query.customer}</p>
                    <p className="text-sm">{query.subject}</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/support')}
                  >
                    Respond
                  </Button>
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
