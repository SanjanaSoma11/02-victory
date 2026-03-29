-- Row-level security for appointments, custom field definitions, and audit log.

ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS custom_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_log ENABLE ROW LEVEL SECURITY;

-- Appointments: signed-in staff may read and write
DROP POLICY IF EXISTS "appointments_select_staff" ON appointments;
CREATE POLICY "appointments_select_staff" ON appointments
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles));

DROP POLICY IF EXISTS "appointments_insert_staff" ON appointments;
CREATE POLICY "appointments_insert_staff" ON appointments
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles));

DROP POLICY IF EXISTS "appointments_update_staff" ON appointments;
CREATE POLICY "appointments_update_staff" ON appointments
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles));

DROP POLICY IF EXISTS "appointments_delete_staff" ON appointments;
CREATE POLICY "appointments_delete_staff" ON appointments
  FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles));

-- Field definitions: staff read; admins manage
DROP POLICY IF EXISTS "custom_fields_select_staff" ON custom_field_definitions;
CREATE POLICY "custom_fields_select_staff" ON custom_field_definitions
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles));

DROP POLICY IF EXISTS "custom_fields_admin_all" ON custom_field_definitions;
CREATE POLICY "custom_fields_admin_all" ON custom_field_definitions
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Audit log: staff insert; admins read
DROP POLICY IF EXISTS "audit_insert_staff" ON audit_log;
CREATE POLICY "audit_insert_staff" ON audit_log
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles));

DROP POLICY IF EXISTS "audit_select_admin" ON audit_log;
CREATE POLICY "audit_select_admin" ON audit_log
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
