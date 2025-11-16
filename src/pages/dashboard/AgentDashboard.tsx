import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, UserPlus, FileText, MessageSquare, LogOut, DollarSign, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const agentName = localStorage.getItem('email')?.split('@')[0] || 'Agent';

  const [customers, setCustomers] = useState([
    { id: 1, name: "Amit Kumar", email: "amit@example.com", phone: "+91 98765 43210", policies: 2, address: "Mumbai" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43211", policies: 1, address: "Delhi" }
  ]);

  const [customerForm, setCustomerForm] = useState({
    name: "", email: "", phone: "", address: "", dob: "", gender: ""
  });

  const [assignPolicyForm, setAssignPolicyForm] = useState({
    customerId: "", policyId: "", startDate: "", endDate: "", premiumAmount: ""
  });

  const [claims, setClaims] = useState([
    { id: "CLM-1001", customer: "Amit Kumar", policy: "Premium Health Shield", amount: 25000, status: "pending", date: "2024-11-15", notes: "" },
    { id: "CLM-1002", customer: "Priya Sharma", policy: "Family Care Plus", amount: 15000, status: "under_review", date: "2024-11-14", notes: "Agent added initial notes" }
  ]);

  const [claimAssist, setClaimAssist] = useState<any>(null);
  const [agentNotes, setAgentNotes] = useState("");

  const [payments] = useState([
    { id: "PAY-001", customer: "Amit Kumar", policy: "Premium Health Shield", amount: 15000, status: "paid", date: "2024-11-01" },
    { id: "PAY-002", customer: "Priya Sharma", policy: "Family Care Plus", amount: 25000, status: "paid", date: "2024-10-15" }
  ]);

  const [supportQueries, setSupportQueries] = useState([
    { id: "SUP-001", customer: "Amit Kumar", subject: "Policy Coverage Query", status: "open", date: "2024-11-15", response: "" },
    { id: "SUP-002", customer: "Priya Sharma", subject: "Claim Status", status: "in_progress", date: "2024-11-14", response: "" }
  ]);

  const policies = [
    { id: 1, name: "Premium Health Shield", type: "health", premium: 15000 },
    { id: 2, name: "Family Care Plus", type: "family", premium: 25000 },
    { id: 3, name: "Life Secure Pro", type: "life", premium: 12000 }
  ];

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers([...customers, { id: Date.now(), ...customerForm, policies: 0 }]);
    toast({ title: "✅ Customer Registered", description: `${customerForm.name} added to your customer list` });
    setCustomerForm({ name: "", email: "", phone: "", address: "", dob: "", gender: "" });
  };

  const handleAssignPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id.toString() === assignPolicyForm.customerId);
    if (customer) {
      setCustomers(customers.map(c => c.id.toString() === assignPolicyForm.customerId ? { ...c, policies: c.policies + 1 } : c));
      toast({ title: "✅ Policy Assigned", description: `Policy assigned to ${customer.name}` });
      setAssignPolicyForm({ customerId: "", policyId: "", startDate: "", endDate: "", premiumAmount: "" });
    }
  };

  const handleAddClaimNotes = () => {
    if (claimAssist) {
      setClaims(claims.map(c => c.id === claimAssist.id ? { ...c, status: "under_review", notes: agentNotes } : c));
      toast({ title: "✅ Notes Added", description: "Claim updated and forwarded to admin for approval" });
      setClaimAssist(null);
      setAgentNotes("");
    }
  };

  const handleRespondToQuery = (id: string, response: string) => {
    setSupportQueries(supportQueries.map(q => q.id === id ? { ...q, response, status: 'in_progress' } : q));
    toast({ title: "✅ Response Sent", description: "Customer notified of your response" });
  };

  const getStatusColor = (s: string) => ({
    active: 'bg-success text-success-foreground', approved: 'bg-success text-success-foreground', paid: 'bg-success text-success-foreground',
    rejected: 'bg-destructive text-destructive-foreground',
    pending: 'bg-warning text-warning-foreground', open: 'bg-warning text-warning-foreground', under_review: 'bg-warning text-warning-foreground', in_progress: 'bg-primary text-primary-foreground'
  }[s] || 'bg-muted');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">🤝 AGENT DASHBOARD</h1>
              <p className="text-sm text-muted-foreground">Customer Management & Policy Sales</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <LogOut className="h-4 w-4 mr-2" />Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card><CardContent className="pt-6"><Users className="h-12 w-12 text-primary mb-2" /><p className="text-2xl font-bold">{customers.length}</p><p className="text-sm text-muted-foreground">My Customers</p></CardContent></Card>
          <Card><CardContent className="pt-6"><FileText className="h-12 w-12 text-primary mb-2" /><p className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.policies, 0)}</p><p className="text-sm text-muted-foreground">Policies Sold</p></CardContent></Card>
          <Card><CardContent className="pt-6"><ClipboardList className="h-12 w-12 text-warning mb-2" /><p className="text-2xl font-bold">{claims.filter(c => c.status === 'pending' || c.status === 'under_review').length}</p><p className="text-sm text-muted-foreground">Pending Claims</p></CardContent></Card>
          <Card><CardContent className="pt-6"><DollarSign className="h-12 w-12 text-success mb-2" /><p className="text-2xl font-bold">₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}</p><p className="text-sm text-muted-foreground">Premium Collected</p></CardContent></Card>
        </div>

        <Tabs defaultValue="customers">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="customers">👥 My Customers</TabsTrigger>
            <TabsTrigger value="register">➕ Register</TabsTrigger>
            <TabsTrigger value="assign">📋 Assign Policy</TabsTrigger>
            <TabsTrigger value="claims">📄 Claims</TabsTrigger>
            <TabsTrigger value="support">💬 Support</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card>
              <CardHeader><CardTitle>My Customers ({customers.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {customers.map((c) => (
                  <div key={c.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.email}</p>
                        <p className="text-sm text-muted-foreground">{c.phone} • {c.address}</p>
                      </div>
                      <Badge>{c.policies} Policies</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => { setAssignPolicyForm({ ...assignPolicyForm, customerId: c.id.toString() }); }}>Assign Policy</Button>
                      <Button size="sm" variant="outline" onClick={() => navigate('/policies')}>View Policies</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Register New Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterCustomer} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Customer Name" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="customer@example.com" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+91 98765 43210" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" value={customerForm.dob} onChange={(e) => setCustomerForm({ ...customerForm, dob: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(v) => setCustomerForm({ ...customerForm, gender: v })} value={customerForm.gender}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea placeholder="Customer Address" value={customerForm.address} onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })} rows={3} required />
                  </div>
                  <Button type="submit" className="w-full">Register Customer</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assign">
            <Card>
              <CardHeader><CardTitle>Assign Policy to Customer</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAssignPolicy} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Customer</Label>
                    <Select onValueChange={(v) => setAssignPolicyForm({ ...assignPolicyForm, customerId: v })} value={assignPolicyForm.customerId}>
                      <SelectTrigger><SelectValue placeholder="Choose customer" /></SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Policy</Label>
                    <Select onValueChange={(v) => setAssignPolicyForm({ ...assignPolicyForm, policyId: v })} value={assignPolicyForm.policyId}>
                      <SelectTrigger><SelectValue placeholder="Choose policy" /></SelectTrigger>
                      <SelectContent>
                        {policies.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name} - ₹{p.premium.toLocaleString()}/year</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" value={assignPolicyForm.startDate} onChange={(e) => setAssignPolicyForm({ ...assignPolicyForm, startDate: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" value={assignPolicyForm.endDate} onChange={(e) => setAssignPolicyForm({ ...assignPolicyForm, endDate: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Premium Amount (₹)</Label>
                    <Input type="number" placeholder="15000" value={assignPolicyForm.premiumAmount} onChange={(e) => setAssignPolicyForm({ ...assignPolicyForm, premiumAmount: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full">Assign Policy</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Claims Assistance</CardTitle>
                <p className="text-sm text-muted-foreground">Help customers with claims (Admin approval required)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {claims.map((c) => (
                  <div key={c.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2"><p className="font-semibold">{c.id}</p><Badge className={getStatusColor(c.status)}>{c.status.replace('_', ' ')}</Badge></div>
                        <p className="text-sm">{c.customer} - {c.policy}</p>
                        <p className="text-sm">Amount: ₹{c.amount.toLocaleString()}</p>
                        {c.notes && <p className="text-xs text-muted-foreground mt-2">Notes: {c.notes}</p>}
                      </div>
                      <p className="text-sm text-muted-foreground">{c.date}</p>
                    </div>
                    {c.status === 'pending' && (
                      <Button size="sm" onClick={() => setClaimAssist(c)}>Add Notes & Forward to Admin</Button>
                    )}
                    {c.status === 'under_review' && (
                      <p className="text-sm text-primary">✓ Forwarded to Admin for approval</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader><CardTitle>Customer Support Queries</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {supportQueries.map((q) => (
                  <div key={q.id} className="p-4 bg-muted rounded">
                    <div className="flex items-center gap-2 mb-2"><p className="font-semibold">{q.id}</p><Badge className={getStatusColor(q.status)}>{q.status.replace('_', ' ')}</Badge></div>
                    <p className="text-sm font-medium">{q.subject}</p>
                    <p className="text-sm text-muted-foreground">{q.customer}</p>
                    {q.response && <p className="text-sm mt-2 p-2 bg-primary-light rounded">Response: {q.response}</p>}
                    {q.status === 'open' && (
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" className="mt-3">Respond</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Respond to {q.customer}</DialogTitle></DialogHeader>
                          <p className="text-sm"><strong>Subject:</strong> {q.subject}</p>
                          <Textarea placeholder="Type response..." rows={5} onChange={(e) => e.target.setAttribute('data-response', e.target.value)} />
                          <Button onClick={(e) => { const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement; handleRespondToQuery(q.id, textarea.getAttribute('data-response') || ''); }} className="w-full">Send Response</Button>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {claimAssist && (
        <Dialog open={!!claimAssist} onOpenChange={() => setClaimAssist(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Assist with Claim {claimAssist.id}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded"><p className="text-sm"><strong>Customer:</strong> {claimAssist.customer}</p><p className="text-sm"><strong>Policy:</strong> {claimAssist.policy}</p><p className="text-sm"><strong>Amount:</strong> ₹{claimAssist.amount.toLocaleString()}</p></div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded"><p className="text-sm font-semibold text-yellow-800">⚠️ Agent Note:</p><p className="text-sm text-yellow-700">You can add notes and forward to admin. Only admin can approve/reject claims.</p></div>
              <Textarea placeholder="Add notes for admin..." value={agentNotes} onChange={(e) => setAgentNotes(e.target.value)} rows={4} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setClaimAssist(null)}>Cancel</Button>
                <Button onClick={handleAddClaimNotes}>Add Notes & Forward to Admin</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AgentDashboard;
