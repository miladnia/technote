import os
import sys
import pytest
from pathlib import Path

basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(basedir)

from technote import list_filesystem


@pytest.fixture
def setup_test_environment():
    """Creates a temporary test environment inside the user's home directory."""
    home = Path.home().resolve()
    test_dir = home / "test_directory"
    test_subdir = test_dir / "subdir"
    test_md_file = test_dir / "file.md"

    # Create test directories and file
    test_dir.mkdir(parents=True, exist_ok=True)
    test_subdir.mkdir(parents=True, exist_ok=True)
    test_md_file.touch()

    yield home, test_dir, test_subdir, test_md_file

    # Cleanup after test
    test_md_file.unlink()
    test_subdir.rmdir()
    test_dir.rmdir()


def test_list_filesystem_valid(setup_test_environment):
    """Tests listing a valid directory inside the home folder."""
    home, test_dir, test_subdir, _ = setup_test_environment
    result = list_filesystem("test_directory")

    assert len(result) >= 2  # Must include "." and ".."
    assert result[0]["name"] == "."
    assert result[1]["name"] == ".."
    assert any(entry["name"] == "subdir" for entry in result)

def test_list_filesystem_not_found(setup_test_environment):
    """Tests handling of a non-existent directory."""
    with pytest.raises(ValueError, match=r"^Not found: .*"):
        list_filesystem("non_existent_directory")


def test_list_filesystem_access_denied(setup_test_environment):
    """Tests access restriction when attempting to escape the home directory."""
    with pytest.raises(ValueError, match=r"^Access denied: .*"):
        list_filesystem("../../etc")

    with pytest.raises(ValueError, match=r"^Access denied: .*"):
        list_filesystem("/home")


def test_list_filesystem_parent_directory(setup_test_environment):
    """Tests that the parent directory entry is correct."""
    home, test_dir, _, _ = setup_test_environment
    result = list_filesystem("test_directory")

    assert result[1]["name"] == ".."
    assert result[1]["real_path"] == str(home if test_dir == home else test_dir.parent)


def test_list_filesystem_traversal_handling(setup_test_environment):
    """Ensures `..` components in input are correctly resolved."""
    home, test_dir, test_subdir, _ = setup_test_environment
    result = list_filesystem("test_directory/../test_directory")

    assert any(entry["name"] == "subdir" for entry in result)


def test_list_filesystem_markdown_files(setup_test_environment):
    """Checks that markdown files are correctly listed."""
    _, test_dir, _, test_md_file = setup_test_environment
    result = list_filesystem("test_directory")

    md_files = [entry for entry in result if entry["type"] == "file"]
    assert len(md_files) == 1
    assert md_files[0]["name"] == "file.md"
