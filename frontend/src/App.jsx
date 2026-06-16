import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import VerdoraAssistant from "@/components/VerdoraAssistant";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SellerRegister from "@/pages/SellerRegister";
import Vegetables from "@/pages/Vegetables";
import Fruits from "@/pages/Fruits";
import BulkOrders from "@/pages/BulkOrders";
import Farmers from "@/pages/Farmers";
import Offers from "@/pages/Offers";
import Cart from "@/pages/Cart";
import SellerDashboard from "@/pages/SellerDashboard";
import AdminPanel from "@/pages/AdminPanel";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import Marketplace from "@/pages/Marketplace";

import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/context/CartContext";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRoles, ...rest }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} component={Component} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/seller-register" component={SellerRegister} />
      <Route path="/vegetables" component={Vegetables} />
      <Route path="/fruits" component={Fruits} />
      <Route path="/bulk-orders" component={BulkOrders} />
      <Route path="/farmers" component={Farmers} />
      <Route path="/offers" component={Offers} />
      <Route path="/cart" component={Cart} />
      <Route path="/profile" component={Profile} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/marketplace" component={Marketplace} />
      <ProtectedRoute path="/seller/dashboard" component={SellerDashboard} allowedRoles={["admin", "seller"]} />
      <ProtectedRoute path="/admin" component={AdminPanel} allowedRoles={["admin"]} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <VerdoraAssistant />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
