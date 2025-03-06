import { useEffect, useState } from 'react';

function Explorer({ apiUrl }) {
  const [entries, setEntries] = useState([]);
  const [currentDir, setCurrentDir] = useState('');

  useEffect(() => {
    const directory_path = encodeURIComponent(currentDir?.['path'] || '');
    const url = `${apiUrl}/${directory_path}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setEntries(data));
  }, [currentDir]);

  const handleDirSelect = (dir) => {
    setCurrentDir(dir);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Directory</th>
          <th scope="col">Path</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <Row key={entry['name']} entry={entry} onDirSelect={handleDirSelect}  />
        ))}
      </tbody>
    </table>
  );
}

function Row({ entry, onDirSelect }) {
  const isDir = 'directory' === entry['type'];
  const handleDirSelect = () => onDirSelect(entry);
  return (
    <tr>
      <th scope="row">
        <button
          className='btn btn-link p-0 text-decoration-none'
          type='button'
          onClick={isDir ? handleDirSelect : undefined}
          disabled={!isDir}>
            {entry['name']}
        </button>
      </th>
      <td>{entry['real_path']}</td>
    </tr>
  );
}

export default Explorer;
