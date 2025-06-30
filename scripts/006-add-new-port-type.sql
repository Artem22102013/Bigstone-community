DO $$
DECLARE
  -- Change this for new allowed types:
  type_check text := '(''BIN'',''HEX'',''ITEM'')';


  constraint_name text;
BEGIN
  SELECT conname
    INTO constraint_name
    FROM pg_constraint
   WHERE conrelid = 'ports'::regclass
     AND contype  = 'c'
  LIMIT 1;

  EXECUTE format(
    'ALTER TABLE ports DROP CONSTRAINT %I',
    constraint_name
  );

  EXECUTE format(
    'ALTER TABLE ports ADD CONSTRAINT %I CHECK (type IN %s)',
    constraint_name, type_check
  );
END
$$;
