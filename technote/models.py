from dataclasses import dataclass
from pathlib import Path


@dataclass
class DataOptions:
    plain_object: bool = False
    url_handler: callable = None


@dataclass
class Directory:
    id: str
    name: str
    path: str
    url: str | None = None


    def from_db_row(db_row: dict, options: DataOptions = None) -> type:
        return Directory(
            id=db_row["directory_id"],
            name=db_row["directory_name"],
            path=db_row["directory_path"]
                if options and options.plain_object else Path(db_row["directory_path"]),
            url=options.url_handler(db_row["directory_id"])
                if options and options.url_handler else "",
        )


@dataclass
class Note:
    id: str
    name: str
    directory_name: str
    path: Path | None = None
    content: str = ""
    preview: str = ""
    url: str | None = None


    @staticmethod
    def from_db_row(db_row: dict, options: DataOptions = None) -> type:
        path = Path(db_row["directory_path"]) / str(db_row["note_filename"])
        return Note(
            id=db_row["note_id"],
            name=db_row["note_pretty_name"],
            directory_name=db_row["directory_name"],
            path=str(path.resolve())
                if options and options.plain_object else path,
            url=options.url_handler(db_row["note_id"])
                if options and options.url_handler else "",
        )
