from dataclasses import dataclass
from flask import url_for
from .entities import Directory, Note


@dataclass
class NoteDTO:
    id: str
    name: str
    location_on_disk: str | None = None
    url: str | None = None
    html_content_url: str | None = None
    plain_content_url: str | None = None


    @staticmethod
    def from_domain(note: Note) -> type:
        return NoteDTO(
            id=note.id,
            name=note.name,
            location_on_disk=str(note.path.resolve()),
            url=url_for("note", note_id=note.id),
            html_content_url=url_for("html_note", note_id=note.id),
            plain_content_url=url_for("plain_note", note_id=note.id),
        )


@dataclass
class DirectoryDTO:
    id: str
    name: str
    location_on_disk: str
    url: str | None
    notes: list[NoteDTO]


    @staticmethod
    def from_domain(directory: Directory, notes: list[Note] = []) -> type:
        return DirectoryDTO(
            id=directory.id,
            name=directory.name,
            location_on_disk=str(directory.path),
            url=url_for("list_directory", directory_id=directory.id),
            notes=[NoteDTO.from_domain(note) for note in notes],
        )


@dataclass
class NavigatorDTO:
    directory_list: list[DirectoryDTO] | None = None
    directory: DirectoryDTO | None = None
