import React, { Component } from "react";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Welcome to DatBoi Coin:</h1>
          <h2>A Block Chain Based Image Hosting Web App</h2>
          <p>Hosting information has traditionally been done through centralized servers. This structure allows whoever controls the servers to control the content that people can access. In a world where media conglomerates and governments have growing financial and social interests in limiting a content consumer’s freedom to information there needs to be a more democratic solution to hosting information on the internet. This solution both needs to be able to host the same kinds of information as a centralized server and have a built-in mechanism to ensure consumers the information is not being tampered with when it is shared across a network. We aim to solve these issues by creating a democratic, decentralized image hosting site.</p>

            <p>Our solution will utilize blockchain technology to both provide an open ledger to consumers to prove their content is not being adulterated when it is hosted; and to create a financial reward for our user community to promote our system’s growth and maintenance. A decentralized image hosting system with an open ledger can create a free and democratic image hosting community.
</p>
        </div>
      </div>
    );
  }
}

