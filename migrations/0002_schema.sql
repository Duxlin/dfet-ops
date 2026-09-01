-- DFET Ops — company-wide staff, task, asset, and reporting schema.
-- Shared (not per-user isolated): every query is authorized via staff.role.

create table if not exists departments (
  id serial primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists staff (
  id serial primary key,
  user_id text unique,
  staff_id text not null unique,
  full_name text not null,
  email text not null unique,
  phone text,
  department_id int references departments(id) on delete set null,
  position text,
  role text not null default 'staff',
  employment_type text not null default 'employee',
  employment_status text not null default 'active',
  date_joined date,
  profile_picture text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists staff_user_id_idx on staff (user_id);
create index if not exists staff_role_idx on staff (role);
create index if not exists staff_status_idx on staff (employment_status);

create table if not exists tasks (
  id serial primary key,
  title text not null,
  description text,
  priority text not null default 'medium',
  status text not null default 'pending',
  deadline timestamptz,
  created_by int not null references staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tasks_status_idx on tasks (status);
create index if not exists tasks_deadline_idx on tasks (deadline);

create table if not exists task_assignees (
  task_id int not null references tasks(id) on delete cascade,
  staff_id int not null references staff(id) on delete cascade,
  primary key (task_id, staff_id)
);

create table if not exists task_comments (
  id serial primary key,
  task_id int not null references tasks(id) on delete cascade,
  staff_id int not null references staff(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists attachments (
  id serial primary key,
  entity_type text not null,
  entity_id int not null,
  filename text not null,
  mime_type text not null,
  data_url text not null,
  uploaded_by int references staff(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists attachments_entity_idx on attachments (entity_type, entity_id);

create table if not exists activity_reports (
  id serial primary key,
  staff_id int not null references staff(id) on delete cascade,
  report_date date not null,
  period text not null default 'daily',
  tasks_completed text,
  challenges text,
  status text not null default 'submitted',
  reviewer_id int references staff(id) on delete set null,
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (staff_id, report_date, period)
);

create index if not exists reports_status_idx on activity_reports (status);
create index if not exists reports_date_idx on activity_reports (report_date);

create table if not exists assets (
  id serial primary key,
  asset_code text not null unique,
  asset_type text not null,
  brand text,
  model text,
  serial_number text,
  purchase_date date,
  condition text not null default 'good',
  status text not null default 'available',
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assets_status_idx on assets (status);
create index if not exists assets_type_idx on assets (asset_type);

create table if not exists asset_assignments (
  id serial primary key,
  asset_id int not null references assets(id) on delete cascade,
  assigned_to_type text not null,
  staff_id int references staff(id) on delete set null,
  customer_name text,
  customer_contact text,
  location text,
  assigned_by int references staff(id) on delete set null,
  assigned_at timestamptz not null default now(),
  returned_at timestamptz,
  notes text
);

create index if not exists asset_assignments_asset_idx on asset_assignments (asset_id);

create table if not exists maintenance_records (
  id serial primary key,
  asset_id int not null references assets(id) on delete cascade,
  maintenance_date date not null,
  maintenance_type text not null,
  issue text,
  status text not null default 'open',
  performed_by text,
  notes text,
  created_by int references staff(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id serial primary key,
  staff_id int not null references staff(id) on delete cascade,
  title text not null,
  body text,
  kind text not null,
  entity_type text,
  entity_id int,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_staff_idx on notifications (staff_id, created_at desc);

create table if not exists audit_logs (
  id serial primary key,
  staff_id int references staff(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id int,
  detail text,
  created_at timestamptz not null default now()
);

insert into departments (name) values
  ('Administration'),
  ('Customer Relations'),
  ('Field Operations'),
  ('IT Support'),
  ('Human Resources'),
  ('Sales'),
  ('Finance')
on conflict (name) do nothing;
