// components/Home.js
import "./Home.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Your buyers hate <span>cold sales</span>.
            <br /> SalesMind makes them human.
          </h1>
          <p>
            AI-powered lead generation, outreach, and analytics —
            built to help you close smarter, faster.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn primary">Start Free</Link>
            <Link to="/dashboard" className="btn ghost">View Dashboard</Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="float-card">AI Personalization</div>
          <div className="float-card delay">Auto Outreach</div>
          <div className="float-card delay-2">Lead Scoring</div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Everything you need from lead to deal</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Smart Lead Import</h3>
            <p>Apollo, CSVs & APIs — automated.</p>
          </div>
          <div className="feature-card">
            <h3>AI Outreach</h3>
            <p>Hyper-personalized emails at scale.</p>
          </div>
          <div className="feature-card">
            <h3>Engagement Tracking</h3>
            <p>Opens, replies & intent signals.</p>
          </div>
          <div className="feature-card">
            <h3>Unified Dashboard</h3>
            <p>Everything in one clean interface.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start selling smarter today</h2>
        <Link to="/b2b" className="btn primary">Generate B2B Leads</Link>
      </section>
    </>
  );
}

export default Home;
