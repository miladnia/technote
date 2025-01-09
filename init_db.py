import sqlite3

from config import DATABASE, DATABASE_SCHEMA

connection = sqlite3.connect(DATABASE)

with open(DATABASE_SCHEMA) as schema_file:
    connection.executescript(schema_file.read())


# cur = connection.cursor()

# cur.execute("INSERT INTO folders(folder_name) VALUES (?)",
#             ("Recent notes"))

# cur.execute("INSERT INTO folders(folder_name) VALUES (?)",
#             ("Recently modified"))

connection.commit()
connection.close()
