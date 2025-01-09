from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class Note:
    id: str
    name: str
    path: Path | None = None,
    content: str = "",
    preview: str = ""
