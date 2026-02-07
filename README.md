# Enterprise-Risk-Analytics-Data-Monitoring-Platform
📌 Project Overview

This project implements an enterprise-style Data & Analytics platform designed to monitor operational performance and assess risk levels across departments.
It integrates cleaned operational and risk data, applies analytics-ready data modeling, and enables risk-driven decision making, similar to real-world EY GDS consulting engagements.

The solution demonstrates Data Engineering, Analytics, Technology Risk, and SDLC best practices.

⸻

🎯 Business Problem

Organizations often face challenges such as:
	•	Siloed operational and risk data
	•	Manual and delayed reporting
	•	Limited visibility into enterprise-wide risks
	•	Reactive rather than proactive risk management

This project addresses these challenges by:
	•	Centralizing operational and risk data
	•	Structuring analytics-ready datasets
	•	Supporting department-wise and time-based risk analysis

⸻

🗂️ Dataset Description

The final dataset is a preprocessed and cleaned CSV file containing 91,626 enterprise records with the following attributes:
	•	dept_id
	•	dept_name
	•	date
	•	month
	•	transactions
	•	errors
	•	delay_minutes
	•	error_rate
	•	event_id
	•	risk_type
	•	severity
	•	severity_score
	•	high_risk_flag (0 / 1)

⸻

🏗️ Solution Architecture
Preprocessed CSV Data
        ↓
MySQL Workbench
        ↓
Risk Analytics Table (Structured Schema)
        ↓
SQL-Based Analytics & Reporting

This architecture mirrors a typical consulting data pipeline used in Data & Analytics and Technology Risk projects.

⸻

🧱 Database Design

A single consolidated analytics table was designed to support efficient querying and reporting:

Table Name: preprocessed_enterprise_data

Key design considerations:
	•	Composite primary key for data integrity
	•	Constraints for data validation
	•	Analytics-friendly schema
	•	Governance and risk-readiness

⸻

🔄 Software Development Life Cycle (SDLC)

The project follows a structured SDLC approach, aligned with consulting delivery models:

1️⃣ Requirements & Understanding
	•	Analyzed operational and risk data requirements
	•	Identified key business questions related to performance and risk
	•	Defined analytics and reporting needs

2️⃣ Design
	•	Designed a relational schema optimized for analytics
	•	Defined primary keys, constraints, and data types
	•	Planned bulk data ingestion strategy

3️⃣ Development
	•	Implemented database schema using MySQL
	•	Prepared data for ingestion through preprocessing and cleansing
	•	Loaded large-scale data using MySQL Workbench tools

4️⃣ Testing & Validation
	•	Verified record counts post-ingestion
	•	Validated data accuracy and constraint enforcement
	•	Checked business rules such as error rates and risk flags

5️⃣ Deployment & Usage
	•	Enabled SQL-based analytics and reporting
	•	Prepared dataset for dashboards and risk analysis
	•	Ensured scalability for enterprise-sized datasets

⸻

📈 Analytics Capabilities

The platform enables:
	•	Department-wise risk comparison
	•	Identification of high-risk operational periods
	•	Severity-based risk analysis
	•	Trend analysis over time

These insights reflect real client-facing analytics use cases.

⸻

🔧 Tech Stack
	•	Database: MySQL
	•	Query Language: SQL
	•	Tools: MySQL Workbench, Tableau
	•	Data Format: CSV
	•	Concepts:
	•	Data Engineering
	•	Data Analytics
	•	SDLC
	•	Information Management
	•	Technology Risk
	•	Data Quality & Governance

⸻

🧠 Key Learnings
	•	Applying SDLC to data and analytics projects
	•	Designing analytics-ready enterprise schemas
	•	Handling large-scale data ingestion efficiently
	•	Translating raw data into risk-focused insights
