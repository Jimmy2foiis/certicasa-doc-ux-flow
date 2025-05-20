
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

-- Create Row Level Security (RLS) policies
-- These will be simplified for now and should be adjusted based on your authentication setup
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadastral_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create a basic policy that allows all authenticated users to access these tables
-- In a production environment, you would want more granular control
CREATE POLICY "All users can access clients" ON clients FOR ALL TO authenticated USING (true);
CREATE POLICY "All users can access cadastral_data" ON cadastral_data FOR ALL TO authenticated USING (true);
CREATE POLICY "All users can access projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "All users can access calculations" ON calculations FOR ALL TO authenticated USING (true);
CREATE POLICY "All users can access documents" ON documents FOR ALL TO authenticated USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_cadastral_client_id ON cadastral_data(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_calculations_project_id ON calculations(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
