\# 🛍️ Event-Driven E-Commerce System

\*\*Built by:\*\* Sukhmanpreet Singh \& Jasmeet Singh



This project implements a real-time, event-driven microservice architecture for an e-commerce platform using Node.js, Kafka, MongoDB, and React.



\## 🚀 Overview

The system simulates a real-time order pipeline:

\- Order → Inventory → Payment → Shipping → Dashboard (Live updates)

\- Each service runs independently and communicates via Kafka topics.

\- The Read Model service powers a live React dashboard.



\## 🧰 Tech Stack

\- \*\*Backend:\*\* Node.js, Express, KafkaJS, MongoDB

\- \*\*Frontend:\*\* React + Vite + Socket.io-client

\- \*\*Containerization:\*\* Docker Compose (Kafka, Zookeeper, MongoDB)

\- \*\*Architecture:\*\* Microservices + CQRS + Event-Driven



\## 🧭 How to Run

1\. Start Docker services:

&nbsp;  ```bash

&nbsp;  docker-compose up -d

2\. Start each backend service:

&nbsp;	cd services/order-service \&\& node src/server.js

&nbsp;	cd services/inventory-service \&\& node src/server.js

&nbsp;	cd services/payment-service \&\& node src/server.js

&nbsp;	cd services/shipping-service \&\& node src/server.js

&nbsp;	cd read-model-service \&\& node src/server.js

3\. Start the frontend:

&nbsp;	cd dashboard \&\& npm run dev

Open your browser at:

👉 http://localhost:5174



🧑‍💻 Contributors



Sukhmanpreet Singh



Jasmeet Singh

