# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sqlalchemy import create_engine, text
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "PROJECT1")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Try connecting to MySQL
engine = None
try:
    _engine = create_engine(DATABASE_URL)
    with _engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    engine = _engine
    print("Successfully connected to MySQL database!")
except Exception as e:
    print(f"Error connecting to MySQL: {e}")
    print("Falling back to local CSV file...")

# Load fallback CSV
fallback_df = pd.DataFrame()
try:
    fallback_df = pd.read_csv('../preprocessed_enterprise_data.csv')
    fallback_df.fillna(0, inplace=True)
except Exception as e:
    print(f"Error loading CSV fallback: {e}")

@app.get("/api/kpis")
def get_kpis():
    if engine is not None:
        try:
            query = "SELECT COUNT(*) as total_transactions, AVG(error_rate) as avg_error_rate, SUM(high_risk_flag) as total_high_risk FROM preprocessed_enterprise_data"
            df = pd.read_sql(query, engine)
            return {
                "total_transactions": int(df['total_transactions'].iloc[0]) if pd.notnull(df['total_transactions'].iloc[0]) else 0,
                "avg_error_rate": float(df['avg_error_rate'].iloc[0]) if pd.notnull(df['avg_error_rate'].iloc[0]) else 0.0,
                "total_high_risk": int(df['total_high_risk'].iloc[0]) if pd.notnull(df['total_high_risk'].iloc[0]) else 0
            }
        except Exception as e:
            print(f"MySQL error: {e}")

    # Fallback to CSV
    if fallback_df.empty:
        return {"total_transactions": 0, "avg_error_rate": 0, "total_high_risk": 0}
    
    return {
        "total_transactions": int(len(fallback_df)),
        "avg_error_rate": float(fallback_df['error_rate'].mean()),
        "total_high_risk": int(fallback_df['high_risk_flag'].sum())
    }

@app.get("/api/department-risk")
def get_department_risk():
    if engine is not None:
        try:
            query = """
            SELECT dept_name, SUM(high_risk_flag) as high_risk_flag, SUM(transactions) as transactions, AVG(severity_score) as severity_score 
            FROM preprocessed_enterprise_data 
            GROUP BY dept_name 
            ORDER BY high_risk_flag DESC
            """
            df = pd.read_sql(query, engine)
            return df.to_dict(orient="records")
        except Exception as e:
            print(f"MySQL error: {e}")
            
    # Fallback to CSV
    if fallback_df.empty:
        return []
        
    dept_stats = fallback_df.groupby('dept_name').agg({
        'high_risk_flag': 'sum',
        'transactions': 'sum',
        'severity_score': 'mean'
    }).reset_index()
    dept_stats = dept_stats.sort_values('high_risk_flag', ascending=False)
    return dept_stats.to_dict(orient="records")

@app.get("/api/risk-trends")
def get_risk_trends():
    if engine is not None:
        try:
            query = """
            SELECT month, SUM(high_risk_flag) as high_risk_flag, SUM(transactions) as transactions 
            FROM preprocessed_enterprise_data 
            GROUP BY month 
            ORDER BY month
            """
            df = pd.read_sql(query, engine)
            return df.to_dict(orient="records")
        except Exception as e:
            print(f"MySQL error: {e}")

    # Fallback to CSV
    if fallback_df.empty:
        return []
        
    trends = fallback_df.groupby('month').agg({
        'high_risk_flag': 'sum',
        'transactions': 'sum'
    }).reset_index()
    trends = trends.sort_values('month')
    return trends.to_dict(orient="records")

@app.get("/api/severity-distribution")
def get_severity_distribution():
    if engine is not None:
        try:
            query = "SELECT severity as name, COUNT(*) as value FROM preprocessed_enterprise_data GROUP BY severity"
            df = pd.read_sql(query, engine)
            return df.to_dict(orient="records")
        except Exception as e:
            print(f"MySQL error: {e}")

    # Fallback to CSV
    if fallback_df.empty:
        return []
        
    distribution = fallback_df['severity'].value_counts().reset_index()
    distribution.columns = ['name', 'value']
    return distribution.to_dict(orient="records")

@app.get("/api/risk-types")
def get_risk_types():
    if engine is not None:
        try:
            query = "SELECT risk_type, COUNT(*) as count FROM preprocessed_enterprise_data GROUP BY risk_type"
            df = pd.read_sql(query, engine)
            return df.to_dict(orient="records")
        except Exception as e:
            print(f"MySQL error: {e}")

    # Fallback to CSV
    if fallback_df.empty:
        return []
        
    risk_types = fallback_df['risk_type'].value_counts().reset_index()
    risk_types.columns = ['risk_type', 'count']
    return risk_types.to_dict(orient="records")
