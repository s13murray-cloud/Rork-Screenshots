-- init.sql
-- PostgreSQL Migration Script for Plant & Equipment Pre-Start Inspection App

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums (Safe Creation)
DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('worker', 'supervisor', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE equipment_status_enum AS ENUM ('green', 'amber', 'red');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE entity_status_enum AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE inspection_status_enum AS ENUM ('started', 'submitted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE inspection_result_enum AS ENUM ('ok', 'fault', 'na');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE fault_status_enum AS ENUM ('open', 'rectified');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE entity_type_enum AS ENUM ('equipment', 'response', 'fault', 'rectification');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS Roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name role_enum NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS Companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    status entity_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sites Table
CREATE TABLE IF NOT EXISTS Sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status entity_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);
CREATE INDEX IF NOT EXISTS idx_sites_company ON Sites(company_id);

-- 3.5 Teams Table
CREATE TABLE IF NOT EXISTS Teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);
CREATE INDEX IF NOT EXISTS idx_teams_company ON Teams(company_id);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES Roles(id) ON DELETE RESTRICT,
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE RESTRICT,
    site_id UUID REFERENCES Sites(id) ON DELETE SET NULL, -- Nullable for cross-site managers
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    team_id UUID REFERENCES Teams(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON Users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_site ON Users(site_id);
CREATE INDEX IF NOT EXISTS idx_users_team ON Users(team_id);

-- 5. EquipmentCategories Table
CREATE TABLE IF NOT EXISTS EquipmentCategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Equipment Table
CREATE TABLE IF NOT EXISTS Equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE RESTRICT,
    site_id UUID NOT NULL REFERENCES Sites(id) ON DELETE RESTRICT,
    nickname VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES EquipmentCategories(id) ON DELETE RESTRICT,
    photo_url TEXT,
    status equipment_status_enum NOT NULL DEFAULT 'green',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_equip_status ON Equipment(status);
CREATE INDEX IF NOT EXISTS idx_equip_category ON Equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equip_company ON Equipment(company_id);
CREATE INDEX IF NOT EXISTS idx_equip_site ON Equipment(site_id);

-- 7. Checklists Table
CREATE TABLE IF NOT EXISTS Checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ChecklistVersions Table
CREATE TABLE IF NOT EXISTS ChecklistVersions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID NOT NULL REFERENCES Checklists(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(checklist_id, version_number)
);
CREATE INDEX IF NOT EXISTS idx_checklist_versions ON ChecklistVersions(checklist_id);

-- 9. ChecklistItems Table
CREATE TABLE IF NOT EXISTS ChecklistItems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID NOT NULL REFERENCES ChecklistVersions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sequence_order INT NOT NULL,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_chk_items_version ON ChecklistItems(version_id);

-- 10. EquipmentChecklistAssignments Table
CREATE TABLE IF NOT EXISTS EquipmentChecklistAssignments (
    equipment_id UUID NOT NULL REFERENCES Equipment(id) ON DELETE CASCADE,
    checklist_id UUID NOT NULL REFERENCES Checklists(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (equipment_id, checklist_id)
);

-- 11. Inspections Table (Immutable)
CREATE TABLE IF NOT EXISTS Inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE RESTRICT,
    site_id UUID NOT NULL REFERENCES Sites(id) ON DELETE RESTRICT,
    equipment_id UUID NOT NULL REFERENCES Equipment(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    user_name_snapshot VARCHAR(255),
    version_id UUID NOT NULL REFERENCES ChecklistVersions(id) ON DELETE RESTRICT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    worker_signature TEXT,
    device_id VARCHAR(255),
    gps_location VARCHAR(255),
    ip_address INET,
    status inspection_status_enum NOT NULL DEFAULT 'started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_insp_equip_date ON Inspections(equipment_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_insp_user ON Inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_insp_company ON Inspections(company_id);
CREATE INDEX IF NOT EXISTS idx_insp_site ON Inspections(site_id);

-- 12. InspectionResponses Table (Immutable once submitted)
CREATE TABLE IF NOT EXISTS InspectionResponses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES Inspections(id) ON DELETE CASCADE,
    checklist_item_id UUID NOT NULL REFERENCES ChecklistItems(id) ON DELETE RESTRICT,
    result inspection_result_enum NOT NULL,
    notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_resp_insp ON InspectionResponses(inspection_id);
CREATE INDEX IF NOT EXISTS idx_resp_item_result ON InspectionResponses(checklist_item_id, result);

-- 13. FaultReports Table
CREATE TABLE IF NOT EXISTS FaultReports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE RESTRICT,
    site_id UUID NOT NULL REFERENCES Sites(id) ON DELETE RESTRICT,
    inspection_id UUID NOT NULL REFERENCES Inspections(id) ON DELETE RESTRICT,
    checklist_item_id UUID NOT NULL REFERENCES ChecklistItems(id) ON DELETE RESTRICT,
    equipment_id UUID NOT NULL REFERENCES Equipment(id) ON DELETE RESTRICT,
    reported_by UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    user_name_snapshot VARCHAR(255),
    description TEXT NOT NULL,
    status fault_status_enum NOT NULL DEFAULT 'open',
    reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_faults_equip_status ON FaultReports(equipment_id, status);
CREATE INDEX IF NOT EXISTS idx_faults_date ON FaultReports(reported_at);
CREATE INDEX IF NOT EXISTS idx_faults_company ON FaultReports(company_id);
CREATE INDEX IF NOT EXISTS idx_faults_site ON FaultReports(site_id);

-- 14. FaultStateHistory Table
CREATE TABLE IF NOT EXISTS FaultStateHistory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fault_id UUID NOT NULL REFERENCES FaultReports(id) ON DELETE CASCADE,
    modified_by UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    previous_state fault_status_enum,
    new_state fault_status_enum NOT NULL,
    notes TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_fault_history_fault ON FaultStateHistory(fault_id);

-- 15. FaultRectifications Table (Deprecated physically, mapped here for logical bridging or backward compatibility)
-- Used if historical app logic expects a separate rectifications ledger beyond state history
CREATE TABLE IF NOT EXISTS FaultRectifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fault_id UUID NOT NULL REFERENCES FaultReports(id) ON DELETE CASCADE,
    rectified_by UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. PhotoEvidence Table (Replacing PhotosMedia specifically for compliance tracking)
CREATE TABLE IF NOT EXISTS PhotoEvidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type entity_type_enum NOT NULL,
    entity_id UUID NOT NULL,
    uploader_id UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    url TEXT NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA-256
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_photos_entity ON PhotoEvidence(entity_type, entity_id);

-- 17. AuditLogs Table (Immutable Logger)
CREATE TABLE IF NOT EXISTS AuditLogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_entity_time ON AuditLogs(entity_type, entity_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON AuditLogs(action_type);

-- 18. Invitations Table
CREATE TABLE IF NOT EXISTS Invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES Roles(id) ON DELETE RESTRICT,
    team_id UUID REFERENCES Teams(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, accepted, expired
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON Invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_company ON Invitations(company_id);
