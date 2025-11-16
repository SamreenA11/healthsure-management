import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Download, CreditCard, CheckCircle } from "lucide-react";

const Payments = () => {
  const navigate = useNavigate();

  const paymentHistory = [
    { id: "PAY-001", type: "premium", policy: "Premium Health Shield", amount: 15000, method: "UPI", date: "2024-11-01", status: "success" },
    { id: "PAY-002", type: "premium", policy: "Family Care Plus", amount: 25000, method: "Card", date: "2024-10-15", status: "success" },
    { id: "PAY-003", type: "claim_settlement", policy: "Premium Health Shield", amount: 25000, method: "Bank Transfer", date: "2024-10-20", status: "success" },
    { id: "PAY-004", type: "premium", policy: "Life Secure Pro", amount: 12000, method: "Netbanking", date: "2024-09-28", status: "success" },
  ];

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
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
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
                    <Button variant="ghost" size="sm" className="mt-2">
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
