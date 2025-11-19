/*
  # Create Automata Storage Schema

  1. New Tables
    - `automata`
      - `id` (uuid, primary key) - Unique identifier for each automaton
      - `user_id` (uuid, nullable) - Optional user association for future auth
      - `name` (text) - Name of the automaton
      - `type` (text) - Type: 'dfa', 'pda', or 'turing'
      - `states` (jsonb) - Array of state objects with positions and properties
      - `transitions` (jsonb) - Array of transition objects
      - `alphabet` (text[]) - Array of valid input symbols
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `automata` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public write access (for demo purposes)

  3. Notes
    - This implementation allows public access for simplicity
    - Can be restricted later by adding authentication requirements
*/

CREATE TABLE IF NOT EXISTS automata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL DEFAULT 'Nuevo Autómata',
  type text NOT NULL CHECK (type IN ('dfa', 'pda', 'turing')),
  states jsonb NOT NULL DEFAULT '[]'::jsonb,
  transitions jsonb NOT NULL DEFAULT '[]'::jsonb,
  alphabet text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE automata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view automata"
  ON automata
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert automata"
  ON automata
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update automata"
  ON automata
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete automata"
  ON automata
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_automata_type ON automata(type);
CREATE INDEX IF NOT EXISTS idx_automata_created_at ON automata(created_at DESC);
