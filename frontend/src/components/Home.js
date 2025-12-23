// components/Home.js
import "./Home.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";


function Home() {
  return (
     <>
      <Navbar />
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <h1>The AI Sales Platform for Smarter Growth</h1>
        <p>
          SalesMind AI helps you find leads, personalize outreach, and close deals
          faster using AI-powered automation.
        </p>
        <div className="hero-buttons">
          <Link to="/leads" className="btn primary">Get Started</Link>
          <Link to="/dashboard" className="btn secondary">View Dashboard</Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Everything you need from lead to deal</h2>
        <div className="feature-grid">
          <div className="card">
            <h3>Auto Lead Generation</h3>
            <p>Import leads from Apollo, CSVs, or APIs automatically.</p>
          </div>
          <div className="card">
            <h3>AI Personalization</h3>
            <p>Generate intelligent, personalized outreach messages.</p>
          </div>
          <div className="card">
            <h3>Automated Outreach</h3>
            <p>Send emails or LinkedIn messages at optimal times.</p>
          </div>
          <div className="card">
            <h3>Analytics Dashboard</h3>
            <p>Track opens, replies, and high-potential prospects.</p>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="difference">
        <h2>Why SalesMind AI?</h2>
        <div className="diff-grid">
          <div className="diff-card">AI-Driven Insights</div>
          <div className="diff-card">Unified Sales Dashboard</div>
          <div className="diff-card">Scalable & Cloud Ready</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start selling smarter today</h2>
        <Link to="/b2b" className="btn primary">Generate B2B Leads</Link>
      </section>
    </div>
    </>
  );
}

export default Home;

