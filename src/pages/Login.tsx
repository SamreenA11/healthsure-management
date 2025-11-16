import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - For demo, allow selecting role based on email
    try {
      // Determine role based on email for demo purposes
      let role = 'customer';
      if (formData.email.includes('admin')) {
        role = 'admin';
      } else if (formData.email.includes('agent')) {
        role = 'agent';
      }
      
      const mockUser = {
        role: role,
        token: 'mock-jwt-token',
        email: formData.email
      };
      
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('role', mockUser.role);
      localStorage.setItem('email', mockUser.email);
      
      toast({
        title: "Login Successful",
        description: `Welcome back ${role}!`,
      });
      
      // Navigate based on role
      navigate(`/dashboard/${mockUser.role}`);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Login to your HealthSure account</CardDescription>
          <div className="mt-3 p-3 bg-muted rounded-lg text-left text-sm">
            <p className="font-semibold mb-1">Demo Login Hint:</p>
            <p className="text-muted-foreground">
              Use email containing 'admin' for Admin, 'agent' for Agent, or any other for Customer
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/register')}
                className="text-primary hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
