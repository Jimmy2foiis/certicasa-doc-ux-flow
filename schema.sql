
-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  nif TEXT,
  type TEXT,
  status TEXT DEFAULT 'Activo',
  projects INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cadastral_data table
CREATE TABLE IF NOT EXISTS cadastral_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  utm_coordinates TEXT,
  cadastral_reference TEXT,
  climate_zone TEXT,
  api_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'En cours',
  surface_area NUMERIC,
  roof_area NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE
);

-- Create calculations table
CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  before_layers JSONB,
  after_layers JSONB,
  project_type TEXT,
  surface_area NUMERIC,
  roof_area NUMERIC,
  ventilation_before NUMERIC,
  ventilation_after NUMERIC,
  ratio_before NUMERIC,
  ratio_after NUMERIC,
  u_value_before NUMERIC,
  u_value_after NUMERIC,
  improvement_percent NUMERIC,
  climate_zone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  meets_requirements BOOLEAN DEFAULT false
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'Actif',
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadastral_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "All users can access clients" ON clients;
DROP POLICY IF EXISTS "All users can access cadastral_data" ON cadastral_data;
DROP POLICY IF EXISTS "All users can access projects" ON projects;
DROP POLICY IF EXISTS "All users can access calculations" ON calculations;
DROP POLICY IF EXISTS "All users can access documents" ON documents;

-- CREATE POLICIES FOR CLIENTS TABLE - FULL CRUD ACCESS
-- Policy for SELECT operations
CREATE POLICY "Anyone can select clients" ON clients 
  FOR SELECT USING (true);

-- Policy for INSERT operations
CREATE POLICY "Anyone can insert clients" ON clients 
  FOR INSERT WITH CHECK (true);

-- Policy for UPDATE operations
CREATE POLICY "Anyone can update clients" ON clients 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Policy for DELETE operations
CREATE POLICY "Anyone can delete clients" ON clients 
  FOR DELETE USING (true);

-- POLICIES FOR CADASTRAL_DATA TABLE
CREATE POLICY "Anyone can read cadastral data" ON cadastral_data FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cadastral data" ON cadastral_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cadastral data" ON cadastral_data FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete cadastral data" ON cadastral_data FOR DELETE USING (true);

-- POLICIES FOR PROJECTS TABLE
CREATE POLICY "Anyone can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete projects" ON projects FOR DELETE USING (true);

-- POLICIES FOR CALCULATIONS TABLE
CREATE POLICY "Anyone can read calculations" ON calculations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert calculations" ON calculations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update calculations" ON calculations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete calculations" ON calculations FOR DELETE USING (true);

-- POLICIES FOR DOCUMENTS TABLE
CREATE POLICY "Anyone can read documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert documents" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update documents" ON documents FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete documents" ON documents FOR DELETE USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_cadastral_client_id ON cadastral_data(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_calculations_project_id ON calculations(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
