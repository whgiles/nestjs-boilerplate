
-- ============================================================
-- boilerplate Warehouse (PostgreSQL) — multi-source time snapshots
-- ============================================================

-- Recommended extensions (optional but useful)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- If you use TimescaleDB, uncomment the next line after installing it:
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS example (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
);