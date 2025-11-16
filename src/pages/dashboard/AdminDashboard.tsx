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
import { Shield, Users, FileText, CreditCard, LogOut, Plus, Edit, Trash2, CheckCircle, XCircle, UserCheck, UserX, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [policies, setPolicies] = useState([
    { id: 1, name: "Premium Health Shield", type: "health", premium: 15000, coverage: 500000, status: "active", features: "Cashless, Pre-post coverage" },
    { id: 2, name: "Family Care Plus", type: "family", premium: 25000, coverage: 1000000, status: "active", features: "4 members, Maternity" },
  ]);

  const [newPolicy, setNewPolicy] = useState({ name: "", type: "health", premium: "", coverage: "", features: "" });
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const [users, setUsers] = useState([
    { id: 1, name: "Amit Kumar", email: "amit@example.com", role: "customer", status: "active", phone: "+91 98765 43210" },
    { id: 2, name: "Rajesh Singh", email: "rajesh@example.com", role: "agent", status: "active", phone: "+91 98765 43212" }
  ]);

  const [newAgent, setNewAgent] = useState({ name: "", email: "", phone: "", branch: "" });

  const [claims, setClaims] = useState([
    { id: "CLM-1001", customer: "Amit Kumar", policy: "Premium Health Shield", amount: 25000, status: "pending", date: "2024-11-15", notes: "" },
  ]);

  const [claimAction, setClaimAction] = useState<any>(null);
  const [claimNotes, setClaimNotes] = useState("");
  const [settlementAmount, setSettlementAmount] = useState("");

  const [payments] = useState([
    { id: "PAY-001", customer: "Amit Kumar", amount: 15000, type: "premium", method: "UPI", date: "2024-11-01", status: "success" },
  ]);

  const [supportQueries, setSupportQueries] = useState([
    { id: "SUP-001", customer: "Amit Kumar", subject: "Policy Query", message: "Need help", status: "open", date: "2024-11-15", response: "" },
  ]);

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicies([...policies, { id: Date.now(), ...newPolicy, premium: parseInt(newPolicy.premium), coverage: parseInt(newPolicy.coverage), status: "active" }]);
    toast({ title: "✅ Policy Added Successfully" });
    setNewPolicy({ name: "", type: "health", premium: "", coverage: "", features: "" });
  };

  const handleUpdatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicies(policies.map(p => p.id === editingPolicy.id ? editingPolicy : p));
    toast({ title: "✅ Policy Updated" });
    setEditingPolicy(null);
  };

  const handleDeletePolicy = (id: number) => {
    setPolicies(policies.filter(p => p.id !== id));
    toast({ title: "🗑️ Policy Deleted" });
  };

  const handleTogglePolicyStatus = (id: number) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers([...users, { id: Date.now(), ...newAgent, role: "agent", status: "active" }]);
    toast({ title: "✅ Agent Added" });
    setNewAgent({ name: "", email: "", phone: "", branch: "" });
  };

  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: "🗑️ User Removed" });
  };

  const handleClaimDecision = () => {
    const { claim, action } = claimAction;
    setClaims(claims.map(c => c.id === claim.id ? { ...c, status: action === 'approve' ? 'approved' : 'rejected', notes: claimNotes } : c));
    toast({ title: action === 'approve' ? "✅ Claim Approved" : "❌ Claim Rejected" });
    setClaimAction(null);
    setClaimNotes("");
    setSettlementAmount("");
  };

  const handleRespondToQuery = (id: string, response: string) => {
    setSupportQueries(supportQueries.map(q => q.id === id ? { ...q, response, status: 'resolved' } : q));
    toast({ title: "✅ Response Sent" });
  };

  const getStatusColor = (s: string) => ({
    active: 'bg-success text-success-foreground', approved: 'bg-success text-success-foreground', success: 'bg-success text-success-foreground',
    inactive: 'bg-destructive text-destructive-foreground', blocked: 'bg-destructive text-destructive-foreground', rejected: 'bg-destructive text-destructive-foreground',
    pending: 'bg-warning text-warning-foreground', open: 'bg-warning text-warning-foreground'
  }[s] || 'bg-muted');

  const totalPremiums = payments.filter(p => p.type === 'premium').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">👑 ADMIN DASHBOARD</h1>
              <p className="text-sm text-muted-foreground">Complete System Control</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <LogOut className="h-4 w-4 mr-2" />Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card><CardContent className="pt-6"><Users className="h-12 w-12 text-primary mb-2" /><p className="text-2xl font-bold">{users.length}</p><p className="text-sm text-muted-foreground">Total Users</p></CardContent></Card>
          <Card><CardContent className="pt-6"><FileText className="h-12 w-12 text-primary mb-2" /><p className="text-2xl font-bold">{policies.length}</p><p className="text-sm text-muted-foreground">Total Policies</p></CardContent></Card>
          <Card><CardContent className="pt-6"><FileText className="h-12 w-12 text-warning mb-2" /><p className="text-2xl font-bold">{claims.filter(c => c.status === 'pending').length}</p><p className="text-sm text-muted-foreground">Pending Claims</p></CardContent></Card>
          <Card><CardContent className="pt-6"><DollarSign className="h-12 w-12 text-success mb-2" /><p className="text-2xl font-bold">₹{totalPremiums.toLocaleString('en-IN')}</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
        </div>

        <Tabs defaultValue="policies">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="policies">📋 Policies</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="claims">📄 Claims</TabsTrigger>
            <TabsTrigger value="payments">💰 Payments</TabsTrigger>
            <TabsTrigger value="support">💬 Support</TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Policy Management</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Policy</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add New Policy</DialogTitle></DialogHeader>
                      <form onSubmit={handleAddPolicy} className="space-y-4">
                        <Input placeholder="Policy Name" value={newPolicy.name} onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })} required />
                        <Select onValueChange={(v) => setNewPolicy({ ...newPolicy, type: v })} value={newPolicy.type}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="life">Life</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" placeholder="Premium ₹" value={newPolicy.premium} onChange={(e) => setNewPolicy({ ...newPolicy, premium: e.target.value })} required />
                        <Input type="number" placeholder="Coverage ₹" value={newPolicy.coverage} onChange={(e) => setNewPolicy({ ...newPolicy, coverage: e.target.value })} required />
                        <Textarea placeholder="Features" value={newPolicy.features} onChange={(e) => setNewPolicy({ ...newPolicy, features: e.target.value })} />
                        <Button type="submit" className="w-full">Add Policy</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {policies.map((p) => (
                  <div key={p.id} className="p-4 bg-muted rounded-lg flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2"><p className="font-semibold">{p.name}</p><Badge className={getStatusColor(p.status)}>{p.status}</Badge></div>
                      <p className="text-sm text-muted-foreground">{p.type} | ₹{p.premium.toLocaleString()} | Coverage: ₹{p.coverage.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleTogglePolicyStatus(p.id)}>{p.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingPolicy(p)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePolicy(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Add New Agent</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleAddAgent} className="space-y-4">
                    <Input placeholder="Name" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} required />
                    <Input type="email" placeholder="Email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} required />
                    <Input placeholder="Phone" value={newAgent.phone} onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })} required />
                    <Input placeholder="Branch" value={newAgent.branch} onChange={(e) => setNewAgent({ ...newAgent, branch: e.target.value })} required />
                    <Button type="submit" className="w-full">Add Agent</Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {users.map((u) => (
                    <div key={u.id} className="p-3 bg-muted rounded">
                      <div className="flex items-center gap-2 mb-2"><p className="font-semibold">{u.name}</p><Badge className={getStatusColor(u.status)}>{u.status}</Badge><Badge variant="outline">{u.role}</Badge></div>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggleUserStatus(u.id)}>{u.status === 'active' ? <><UserX className="h-3 w-3 mr-1" />Block</> : <><UserCheck className="h-3 w-3 mr-1" />Activate</>}</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader><CardTitle>Claims Processing</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {claims.map((c) => (
                  <div key={c.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2"><p className="font-semibold">{c.id}</p><Badge className={getStatusColor(c.status)}>{c.status}</Badge></div>
                        <p className="text-sm">{c.customer} - {c.policy}</p>
                        <p className="text-sm">Amount: ₹{c.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.date}</p>
                    </div>
                    {c.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setClaimAction({ claim: c, action: 'approve' })}><CheckCircle className="h-4 w-4 mr-2" />Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => setClaimAction({ claim: c, action: 'reject' })}><XCircle className="h-4 w-4 mr-2" />Reject</Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader><CardTitle>Payment Records</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 bg-muted rounded flex justify-between">
                    <div><p className="font-semibold">{p.id}</p><p className="text-sm">{p.customer}</p><p className="text-xs text-muted-foreground">{p.type} • {p.method}</p></div>
                    <div className="text-right"><p className="font-bold text-success">+₹{p.amount.toLocaleString()}</p><p className="text-xs">{p.date}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader><CardTitle>Support Queries</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {supportQueries.map((q) => (
                  <div key={q.id} className="p-4 bg-muted rounded">
                    <div className="flex items-center gap-2 mb-2"><p className="font-semibold">{q.id}</p><Badge className={getStatusColor(q.status)}>{q.status}</Badge></div>
                    <p className="text-sm font-medium">{q.subject}</p>
                    <p className="text-sm text-muted-foreground">{q.customer}</p>
                    <p className="text-sm mt-2">{q.message}</p>
                    {q.status === 'open' && (
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" className="mt-3">Respond</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Respond to Query</DialogTitle></DialogHeader>
                          <Textarea placeholder="Type response..." rows={5} onChange={(e) => e.target.setAttribute('data-response', e.target.value)} />
                          <Button onClick={(e) => { const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement; handleRespondToQuery(q.id, textarea.getAttribute('data-response') || ''); }} className="w-full">Send</Button>
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

      {claimAction && (
        <Dialog open={!!claimAction} onOpenChange={() => setClaimAction(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{claimAction.action === 'approve' ? 'Approve' : 'Reject'} Claim</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded"><p className="text-sm"><strong>Customer:</strong> {claimAction.claim.customer}</p><p className="text-sm"><strong>Amount:</strong> ₹{claimAction.claim.amount.toLocaleString()}</p></div>
              {claimAction.action === 'approve' && <Input type="number" placeholder="Settlement Amount" value={settlementAmount} onChange={(e) => setSettlementAmount(e.target.value)} />}
              <Textarea placeholder="Admin Notes" value={claimNotes} onChange={(e) => setClaimNotes(e.target.value)} rows={3} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setClaimAction(null)}>Cancel</Button>
                <Button onClick={handleClaimDecision} variant={claimAction.action === 'approve' ? 'default' : 'destructive'}>Confirm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingPolicy && (
        <Dialog open={!!editingPolicy} onOpenChange={() => setEditingPolicy(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Policy</DialogTitle></DialogHeader>
            <form onSubmit={handleUpdatePolicy} className="space-y-4">
              <Input value={editingPolicy.name} onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })} required />
              <Input type="number" value={editingPolicy.premium} onChange={(e) => setEditingPolicy({ ...editingPolicy, premium: e.target.value })} required />
              <Input type="number" value={editingPolicy.coverage} onChange={(e) => setEditingPolicy({ ...editingPolicy, coverage: e.target.value })} required />
              <Textarea value={editingPolicy.features} onChange={(e) => setEditingPolicy({ ...editingPolicy, features: e.target.value })} />
              <Button type="submit" className="w-full">Update</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
