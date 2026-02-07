USE PROJECT1;
CREATE TABLE preprocessed_enterprise_data (
    dept_id           INT NOT NULL,
    dept_name         VARCHAR(50) NOT NULL,
    date_id           DATE NOT NULL,
    month             INT CHECK (month BETWEEN 1 AND 12),

    transactions      INT CHECK (transactions >= 0),
    errors            INT CHECK (errors >= 0),
    delay_minutes     INT CHECK (delay_minutes >= 0),
    error_rate        DECIMAL(5,2),

    event_id          INT,
    risk_type         VARCHAR(50),
    severity          VARCHAR(20),
    severity_score    INT,
    high_risk_flag    TINYINT,

    CONSTRAINT pk_risk_analytics 
	PRIMARY KEY (dept_id, date_id, event_id)
);
select count(record_id ) from preprocessed_enterprise_data;
select * from preprocessed_enterprise_data;
