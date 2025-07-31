-- Add is_recruitment_agency column to lead_generation_job table
ALTER TABLE lead_generation_job 
ADD COLUMN is_recruitment_agency VARCHAR(10) DEFAULT 'No';
