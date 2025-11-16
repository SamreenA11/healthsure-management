import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    priority: "medium",
    message: ""
  });

  const existingTickets = [
    { id: "TKT-5001", subject: "Policy renewal inquiry", status: "open", priority: "medium", date: "2024-11-15" },
    { id: "TKT-5002", subject: "Claim status update", status: "in_progress", priority: "high", date: "2024-11-14", response: "Our team is reviewing your claim documents." },
    { id: "TKT-5003", subject: "Network hospital list", status: "resolved", priority: "low", date: "2024-11-10", response: "Please find the attached list of network hospitals in your area." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket Created",
      description: "Your support ticket has been created. We'll respond within 24 hours.",
    });
    setFormData({ subject: "", priority: "medium", message: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-success text-success-foreground';
      case 'in_progress': return 'bg-warning text-warning-foreground';
      case 'open': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Support Center</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Create Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    defaultValue="medium"
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Ticket
                </Button>
              </form>

              <div className="mt-6 p-4 bg-primary-light rounded-lg">
                <p className="font-semibold mb-2">Need immediate help?</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Call our 24/7 helpline: <strong>1800-XXX-XXXX</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: support@healthsure.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* My Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>My Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{ticket.id}</p>
                        <p className="text-sm mt-1">{ticket.subject}</p>
                      </div>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {ticket.response && (
                      <div className="mt-3 p-3 bg-background rounded border-l-4 border-primary">
                        <p className="text-sm font-semibold mb-1">Response:</p>
                        <p className="text-sm text-muted-foreground">{ticket.response}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className={getPriorityColor(ticket.priority)}>
                        Priority: {ticket.priority}
                      </span>
                      <span className="text-muted-foreground">{ticket.date}</span>
                    </div>
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

export default Support;
