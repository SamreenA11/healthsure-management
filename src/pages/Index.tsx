import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, FileText, Heart, Phone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Wide range of health, life, and family insurance policies"
    },
    {
      icon: Users,
      title: "Expert Agents",
      description: "Dedicated insurance agents to guide you"
    },
    {
      icon: FileText,
      title: "Easy Claims",
      description: "Quick and hassle-free claim processing"
    },
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Round-the-clock customer support"
    }
  ];

  const benefits = [
    "Cashless hospitalization at 5000+ network hospitals",
    "Coverage up to ₹50 lakhs",
    "No waiting period for accidents",
    "Tax benefits under Section 80D",
    "Family floater options available"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">HealthSure</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-foreground">
          Your Health, Our Priority
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Comprehensive health insurance solutions for you and your family. 
          Secure your future with India's most trusted insurance partner.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="text-lg px-8" onClick={() => navigate('/register')}>
            Get Insured Now
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            View Plans
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose HealthSure?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Benefits</h3>
          <div className="max-w-2xl mx-auto space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-card p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to Get Protected?</h3>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of satisfied customers who trust HealthSure
        </p>
        <Button size="lg" className="text-lg px-8" onClick={() => navigate('/register')}>
          Start Your Journey
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HealthSure</span>
              </div>
              <p className="text-muted-foreground">
                India's trusted health insurance partner
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Policies</li>
                <li>Claims</li>
                <li>Network Hospitals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>1800-XXX-XXXX</span>
                </div>
                <p>support@healthsure.com</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 HealthSure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
