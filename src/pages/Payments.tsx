import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, Download, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

const Payments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem('token');
  
  const [paymentForm, setPaymentForm] = useState({
    policyId: "",
    amount: "",
    method: ""
  });

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      console.log('Fetching payments from:', `${API_BASE_URL}/api/payments`);
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched payments:', data);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting payment:', paymentForm);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          purchased_policy_id: paymentForm.policyId,
          amount: parseInt(paymentForm.amount),
          payment_method: paymentForm.method,
          payment_type: 'premium'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment failed:', errorText);
        throw new Error(`Failed to process payment: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment successful:', data);

      toast({
        title: "Payment Successful",
        description: `Payment of ₹${parseInt(paymentForm.amount).toLocaleString('en-IN')} completed successfully.`,
      });
      
      setPaymentForm({ policyId: "", amount: "", method: "" });
      fetchPayments();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleDownloadReceipt = (payment: any) => {
    const receiptContent = `
HEALTHSURE INSURANCE
Payment Receipt
------------------------
Receipt ID: ${payment.id}
Date: ${payment.date}
Policy: ${payment.policy}
Amount: ₹${payment.amount.toLocaleString('en-IN')}
Method: ${payment.method}
Type: ${payment.type === 'premium' ? 'Premium Payment' : 'Claim Settlement'}
Status: ${payment.status}
------------------------
Thank you for your payment!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${payment.id} has been downloaded successfully.`,
    });
  };

  const getTypeColor = (type: string) => {
    return type === 'premium' 
      ? 'bg-primary text-primary-foreground' 
      : 'bg-success text-success-foreground';
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
            <h1 className="text-2xl font-bold text-primary">Payments</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Make Payment Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="policy">Select Policy</Label>
                  <Select onValueChange={(value) => setPaymentForm({ ...paymentForm, policyId: value })} value={paymentForm.policyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Premium Health Shield</SelectItem>
                      <SelectItem value="2">Family Care Plus</SelectItem>
                      <SelectItem value="3">Life Secure Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="15000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select onValueChange={(value) => setPaymentForm({ ...paymentForm, method: value })} value={paymentForm.method}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Debit/Credit Card</SelectItem>
                      <SelectItem value="Netbanking">Netbanking</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Pay Now
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Premiums Paid</p>
                    <p className="text-3xl font-bold mt-2">₹52,000</p>
                  </div>
                  <CreditCard className="h-12 w-12 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Claims Received</p>
                    <p className="text-3xl font-bold mt-2 text-success">₹25,000</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Policies</p>
                    <p className="text-3xl font-bold mt-2">3</p>
                  </div>
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${payment.type === 'premium' ? 'bg-primary-light' : 'bg-green-100'}`}>
                      {payment.type === 'premium' ? (
                        <CreditCard className="h-6 w-6 text-primary" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-success" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{payment.id}</p>
                        <Badge className={getTypeColor(payment.type)}>
                          {payment.type === 'premium' ? 'Premium' : 'Claim Settlement'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{payment.policy}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {payment.method} • {payment.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${payment.type === 'premium' ? '' : 'text-success'}`}>
                      {payment.type === 'premium' ? '-' : '+'}₹{payment.amount.toLocaleString('en-IN')}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleDownloadReceipt(payment)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
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

export default Payments;
