# SQL Style Guide

**Reference:** <https://www.sqlstyle.guide/>

- Use consistent and descriptive identifiers and names.
- Try to only use standard SQL functions instead of vendor-specific functions for reasons of portability.

## Avoid

- camelCase—it is difficult to scan quickly.
- Descriptive prefixes or Hungarian notation such as `sp_` or `tbl`.
- Plurals—use the more natural collective term where possible instead: `staff` instead of `employees` or `people` instead of `individuals`.
- Object-oriented design principles should not be applied to SQL or database structures.

## Naming conventions

- Ensure the name is unique and does not exist as a reserved keyword.
- Keep the length to a maximum of 30 bytes—in practice this is 30 characters unless you are using a multi-byte character set.
- Names must begin with a letter and may not end with an underscore.
- Only letters, numbers and underscores
- Use underscores where you would naturally include a space.
- Avoid abbreviations and if you have to use them make sure they are commonly understood.
- Never give a table the same name as one of its columns and vice versa.
- Avoid, where possible, concatenating two table names together to create the name of a relationship table. Rather than `cars_mechanics` prefer `services`.

### Columns

- Always use the singular name.
- Where possible avoid simply using `id` as the primary identifier for the table.
- Always use lowercase except where it may make sense not to such as proper nouns.

### Aliasing or correlations

- As a rule of thumb the correlation name should be the first letter of each word in the object’s name.
- If there is already a correlation with the same name then append a number.
- For computed data (SUM() or AVG()) use the name you would give it were it a column defined in the schema.

```sql
SELECT first_name AS fn
  FROM staff AS s1
  JOIN students AS s2
    ON s2.mentor_id = s1.staff_num;
```

```sql
SELECT SUM(s.monitor_tally) AS monitor_total
  FROM staff AS s;
```

### Uniform suffixes

> The following suffixes have a universal meaning ensuring the columns can be read and understood easily from SQL code. Use the correct suffix where appropriate.

- `_id`—a unique identifier such as a column that is a primary key.
- `_status`—flag value or some other status of any type such as publication_status.
- `_total`—the total or sum of a collection of values.
- `_num`—denotes the field contains any kind of number.
- `_name`—signifies a name such as first_name.
- `_seq`—contains a contiguous sequence of values.
- `_date`—denotes a column that contains the date of something.
- `_tally`—a count.
- `_size`—the size of something such as a file size or clothing.
- `_addr`—an address for the record could be physical or intangible such as ip_addr.

## Query syntax

- Use uppercase for the reserved keywords like `SELECT` and `WHERE`
- avoid the abbreviated keywords (prefer `ABSOLUTE` to `ABS`)
- Do not use database server specific keywords where an ANSI SQL keyword already exists performing the same function. This helps to make the code more portable.
- Keep all the keywords aligned to the righthand side and the values left aligned:

```sql
SELECT a.title,
       a.release_date, a.recording_date, a.production_date -- grouped dates together
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

- Joins should be indented to the other side of the river :

```sql
SELECT r.last_name
  FROM riders AS r
       INNER JOIN bikes AS b
       ON r.bike_vin_num = b.vin_num
          AND b.engine_tally > 2;
```

- The exception: the `JOIN` keyword should be before the river:

```sql
SELECT r.last_name
  FROM riders AS r
  JOIN bikes AS b
    ON r.bike_vin_num = b.vin_num;
```

### Subqueries

```sql
SELECT r.last_name,
       (SELECT MAX(YEAR(championship_date))
          FROM champions AS c
         WHERE c.last_name = r.last_name
           AND c.confirmed = 'Y') AS last_championship_year
  FROM riders AS r
 WHERE r.last_name IN
       (SELECT c.last_name
          FROM champions AS c
         WHERE YEAR(championship_date) > '2008'
           AND c.confirmed = 'Y');
```

## Preferred formalisms

- Use `BETWEEN` instead of multiple `AND`.
- Use `IN()` instead of multiple `OR`.
- Where a value needs to be interpreted before leaving the database use the `CASE` expression.
- Avoid the use of `UNION` clauses and temporary tables where possible.

```sql
SELECT CASE postcode
       WHEN 'BN1' THEN 'Brighton'
       WHEN 'EH1' THEN 'Edinburgh'
       END AS city
  FROM office_locations
 WHERE country = 'United Kingdom'
   AND opening_time BETWEEN 8 AND 9
   AND postcode IN ('EH1', 'BN1', 'NN1', 'KW1');
```

## Create syntax

- Indent column definitions by four (4) spaces within the `CREATE` definition.
- Where possible do not use vendor-specific data types—these are not portable and may not be available in older versions of the same vendor’s software.
- Only use `REAL` or `FLOAT` types where it is strictly necessary for floating point mathematics otherwise prefer `NUMERIC` and `DECIMAL` at all times. Floating point rounding errors are a nuisance!
- The default value must be the same type as the column.
- Default values must follow the data type declaration and come before any `NOT NULL` statement.
- Tables must have at least one key to be complete and useful.
- Constraints should be given a custom name excepting `UNIQUE`, `PRIMARY KEY` and `FOREIGN KEY` where the database vendor will generally supply sufficiently intelligible names automatically.
- Specify the primary key first right after the `CREATE TABLE` statement.

```sql
CREATE TABLE staff (
    PRIMARY KEY (staff_num),
    staff_num      INT(5)       NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    pens_in_drawer INT(2)       NOT NULL,
                   CONSTRAINT pens_in_drawer_range
                   CHECK(pens_in_drawer BETWEEN 1 AND 99)
);
```

## Designs to avoid

- Object-oriented design principles do not effectively translate to relational database designs—avoid this pitfall.
- Placing the value in one column and the units in another column. The column should make the units self-evident to prevent the requirement to combine columns again later in the application. Use `CHECK()` to ensure valid data is inserted into the column.
- Splitting up data that should be in one table across many tables because of arbitrary concerns such as time-based archiving or location in a multinational organisation. Later queries must then work across multiple tables with `UNION` rather than just simply querying one table.
