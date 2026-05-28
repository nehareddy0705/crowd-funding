import { NavLink } from "react-router-dom";
import * as theme from "../styles/Common";
import { useAuth } from "../store/authStore";

function Footer() {
  const currentYear = new Date().getFullYear();
  const linkClass = "hover:text-white transition-colors";
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);

  const actionLink =
    user?.role === "FUNDRAISER"
      ? { to: "/fundraising", label: "Create Campaign" }
      : user?.role === "ADMIN"
      ? { to: "/admin-dashboard", label: "Dashboard" }
      : { to: "/campaigns", label: "Explore Campaigns" };

  return (
    <footer className="border-t border-peach-light/30 bg-brand-charcoal text-white/90">
      <div className={theme.pageWrapper + " py-16"}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">
              <span className="text-peach-terracotta">Crowd</span>Fund
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Empowering dreams through collective generosity. Together we create meaningful change and transform lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
              <li><NavLink to="/campaigns" className={linkClass}>Campaigns</NavLink></li>
              <li>
                <NavLink to={isAuthenticated ? actionLink.to : "/register"} className={linkClass}>
                  {isAuthenticated ? actionLink.label : "Start Fundraising"}
                </NavLink>
              </li>
              <li><NavLink to="/how-it-works" className={linkClass}>How it Works</NavLink></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">Support</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><NavLink to="/help-center" className={linkClass}>Help Center</NavLink></li>
              <li><NavLink to="/privacy-policy" className={linkClass}>Privacy Policy</NavLink></li>
              <li><NavLink to="/terms-conditions" className={linkClass}>Terms & Conditions</NavLink></li>
              <li><NavLink to="/contact" className={linkClass}>Contact Us</NavLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">Contact</h3>
            <p className="text-white/70 text-sm mb-2">Email</p>
            <p className="text-white font-medium mb-4">support@crowdfund.com</p>
            <NavLink to="/contact" className="text-sm font-bold text-peach-light hover:text-peach-coral transition-colors">
              Contact support
            </NavLink>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} CrowdFund. All rights reserved.
          </p>
          <p className="text-sm text-white/50">Built for donors and fundraisers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
