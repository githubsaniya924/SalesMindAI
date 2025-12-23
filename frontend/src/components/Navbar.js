// components/Navbar.js
import { Link } from "react-router-dom";
import "./Navbar.css";


function Navbar() {
return (
<nav className="navbar">
<div className="nav-left">
<h2 className="logo">SalesMind AI</h2>
<ul className="nav-links">
<li><Link to="/">Home</Link></li>
<li><Link to="/leads">Leads</Link></li>
<li><Link to="/b2b">B2B</Link></li>
<li><Link to="/dashboard">Dashboard</Link></li>
</ul>
</div>


<div className="nav-right">
<Link to="/signin" className="btn signin">Sign In</Link>
<Link to="/signup" className="btn signup">Sign Up</Link>
</div>
</nav>
);
}


export default Navbar;