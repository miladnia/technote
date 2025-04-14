import { useEffect, useState } from "react";
import { Loading } from "@ui";
import { request, requestPOST } from "@utils";
import SingleDirectory from "./SingleDirectory.jsx";
import DirectoryList from "./DirectoryList.jsx";
import NothingToShow from "./NothingToShow.jsx";

function NoteNavigator() {
  const [entries, setEntries] = useState(null);
  const [isHome, setIsHome] = useState(true);
  const isLoading = null === entries;
  const isEmpty = null !== entries && 0 === Object.keys(entries).length;

  const loadEntries = (url = null) => {
    const apiUrl = "/list";
    request(url || apiUrl, (entries) => {
      setEntries(entries);
      setIsHome(null === url);
    });
  };

  const handleDirectoryOpen = (notes) => {
    setEntries(notes);
    setIsHome(false);
  };

  const handleDirectoryClose = (directory) => {
    requestPOST(
      "/close",
      {
        directory_id: directory.id,
      },
      () => {
        loadEntries();
      }
    );
  };

  const handleBackToHomeClick = () => {
    loadEntries();
  };

  const handleDirectoryClick = (directory) => {
    loadEntries(directory.url);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isEmpty) {
    return <NothingToShow onDirectoryOpen={handleDirectoryOpen} />;
  }

  return (
    <>
      {entries.directory && (
        <SingleDirectory
          directory={entries.directory}
          notes={entries.directory.note_list}
          onDirectoryClose={() => handleDirectoryClose(entries.directory)}
          onDirectoryOpen={handleDirectoryOpen}
          hasBackToHome={!isHome}
          onBackToHomeClick={handleBackToHomeClick}
        />
      )}
      {entries.directory_list && (
        <DirectoryList
          directories={entries.directory_list}
          onDirectoryClick={handleDirectoryClick}
          onDirectoryOpen={handleDirectoryOpen}
        />
      )}
    </>
  );
}

export default NoteNavigator;
