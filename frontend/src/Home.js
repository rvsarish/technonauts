import React from "react";
import "./App.css";

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to TECNONAUTS</h2>
      <p className="home-intro">
        At TECNONAUTS, we're not just following the future; we're creating it. Join us on a journey where technology meets creativity, crafting tomorrow's innovations today.
      </p>
      <div className="home-description">
        <p className="home-point">
          We push the boundaries of what's possible, transforming science fiction into science fact.
        </p>
        <p className="home-point">
          Our solutions empower industries, redefine norms, and set new standards.
        </p>
        <p className="home-point">
          Committed to sustainability, we innovate responsibly to shape a better world.
        </p>
      </div>
      <h3 className="home-subtitle">
        Discover Our Real-Time Shoplifting Detection with AI
      </h3>
    </div>
  );
};

export default Home;
