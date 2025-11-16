import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Users, FileText, CreditCard, Settings, LogOut, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [policies, setPolicies] = useState([
    { id: 1, name: "Premium Health Shield", type: "health", premium: 15000, coverage: 500000 },
    { id: 2, name: "Family Care Plus", type: "family", premium: 25000, coverage: 1000000 },
    { id: 3, name: "Life Secure Pro", type: "life", premium: 12000, coverage: 5000000 }
  ]);

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    type: "health",
    premium: "",
    coverage: ""
  });

  const [users, setUsers] = useState([
    { id: 1, name: "Amit Kumar", email: "amit@example.com", role: "customer", status: "active" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", role: "customer", status: "active" },
    { id: 3, name: "Rajesh Singh", email: "rajesh@example.com", role: "agent", status: "active" }
  ]);

  const [claims, setClaims] = useState([
    { id: "CLM-1001", customer: "Amit Kumar", policy: "Premium Health Shield", amount: 25000, status: "pending", date: "2024-11-15" },
    { id: "CLM-1002", customer: "Priya Sharma", policy: "Family Care Plus", amount: 15000, status: "pending", date: "2024-11-14" },
    { id: "CLM-1003", customer: "Amit Kumar", policy: "Premium Health Shield", amount: 8000, status: "approved", date: "2024-11-10" }
  ]);

  const [payments] = useState([
    { id: "PAY-001", customer: "Amit Kumar", amount: 15000, type: "premium", date: "2024-11-01" },
    { id: "PAY-002", customer: "Priya Sharma", amount: 25000, type: "premium", date: "2024-10-15" },
    { id: "PAY-003", customer: "Amit Kumar", amount: 25000, type: "claim_settlement", date: "2024-10-20" }
  ]);

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const policy = {
      id: policies.length + 1,
      name: newPolicy.name,
      type: newPolicy.type,
      premium: parseInt(newPolicy.premium),
      coverage: parseInt(newPolicy.coverage)
    };
    setPolicies([...policies, policy]);
    toast({
      title: "Policy Added",
      description: `${newPolicy.name} has been added successfully.`
    });
    setNewPolicy({ name: "", type: "health", premium: "", coverage: "" });
  };

  const handleDeletePolicy = (policyId: number) => {
    setPolicies(policies.filter(p => p.id !== policyId));
    toast({
      title: "Policy Deleted",
      description: "Policy has been removed successfully."
    });
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
      case 'active': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalPremiums = payments.filter(p => p.type === 'premium').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Complete system management</p>
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
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{users.length}</p>
                </div>
                <Users className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-3xl font-bold mt-2">{policies.length}</p>
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
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold mt-2">₹{totalPremiums.toLocaleString('en-IN')}</p>
                </div>
                <CreditCard className="h-12 w-12 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Policy Management
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Policy</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPolicy} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="policyName">Policy Name</Label>
                      <Input
                        id="policyName"
                        placeholder="e.g., Premium Health Shield"
                        value={newPolicy.name}
                        onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyType">Policy Type</Label>
                      <Select onValueChange={(value) => setNewPolicy({ ...newPolicy, type: value })} value={newPolicy.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="life">Life</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premium">Annual Premium (₹)</Label>
                      <Input
                        id="premium"
                        type="number"
                        placeholder="15000"
                        value={newPolicy.premium}
                        onChange={(e) => setNewPolicy({ ...newPolicy, premium: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverage">Coverage Amount (₹)</Label>
                      <Input
                        id="coverage"
                        type="number"
                        placeholder="500000"
                        value={newPolicy.coverage}
                        onChange={(e) => setNewPolicy({ ...newPolicy, coverage: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Policy</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies.map((policy) => (
                <div key={policy.id} className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{policy.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} | 
                      Premium: ₹{policy.premium.toLocaleString('en-IN')} | 
                      Coverage: ₹{policy.coverage.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{user.name}</p>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground capitalize">Role: {user.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{payment.id}</p>
                        <p className="text-sm text-muted-foreground">{payment.customer}</p>
                        <p className="text-sm capitalize">
                          {payment.type === 'premium' ? 'Premium Payment' : 'Claim Settlement'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${payment.type === 'premium' ? '' : 'text-success'}`}>
                          {payment.type === 'premium' ? '' : '+'}₹{payment.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
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
              Claims Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claims.map((claim) => (
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
                  {claim.status === 'pending' && (
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
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
