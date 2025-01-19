CREATE TABLE IF NOT EXISTS directories(
    directory_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    directory_path TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS notes(
    note_id          TEXT    PRIMARY KEY NOT NULL,
    note_pretty_name TEXT    NOT NULL,
    note_filename    TEXT    NOT NULL,
    note_directory   INTEGER NOT NULL,
    FOREIGN KEY (note_directory)
        REFERENCES directories(directory_id)
);
