-- Malaria Drug Resistance Platform - Database Initialization
-- This script runs when the PostgreSQL container starts

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create placeholder tables (replace with your actual schema)
CREATE TABLE IF NOT EXISTS countries (
    id VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    coordinates GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resistance_reports (
    id SERIAL PRIMARY KEY,
    country_id VARCHAR(3) REFERENCES countries(id),
    drug_name VARCHAR(100) NOT NULL,
    resistance_level VARCHAR(20) NOT NULL,
    efficacy_rate DECIMAL(5,2),
    report_date DATE NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS molecular_markers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_reports_country ON resistance_reports(country_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON resistance_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);

-- Placeholder message
DO $$
BEGIN
    RAISE NOTICE 'Database initialized. Add your actual schema and seed data.';
END $$;
