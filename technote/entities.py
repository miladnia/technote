from dataclasses import dataclass
from pathlib import Path


@dataclass
class Note:
    id: str
    name: str
    path: Path | None = None
    content: str = ""
    preview: str = ""


    @staticmethod
    def from_model(db_row: dict) -> type:
        return Note(
            id=db_row["note_id"],
            name=db_row["note_pretty_name"],
            path=Path(db_row["directory_path"]) / str(db_row["note_filename"]),
        )


@dataclass
class Directory:
    id: str
    name: str
    path: str


    def from_model(db_row: dict) -> type:
        return Directory(
            id=db_row["directory_id"],
            name=db_row["directory_name"],
            path=Path(db_row["directory_path"]),
        )
