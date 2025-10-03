// Test auto-loading functionality
console.log('Testing auto-loading...');

// Test the manifest fetch
fetch('./vault/manifest.json')
  .then(res => res.json())
  .then(data => {
    console.log('Manifest loaded:', data.length, 'files');

    // Test loading first file
    return fetch(`./vault/${data[0]}`);
  })
  .then(res => res.text())
  .then(content => {
    console.log('First file content length:', content.length);
    console.log('First 200 chars:', content.slice(0, 200));

    // Check if auto-load ran
    setTimeout(() => {
      console.log('Checking global state...');
      console.log('Files array length:', window.files ? window.files.length : 'undefined');
      console.log('Notes array length:', window.notes ? window.notes.length : 'undefined');

      // Check DOM content
      const normalView = document.getElementById('normalPkmView');
      const ontologyView = document.getElementById('ontologyPkmView');
      const priorityCenter = document.getElementById('priorityCenter');
      const goalsPanel = document.getElementById('goalsPanel');

      console.log('Normal PKM view content:', normalView ? normalView.innerHTML.length : 'missing');
      console.log('Ontology PKM view content:', ontologyView ? ontologyView.innerHTML.length : 'missing');
      console.log('Priority center content:', priorityCenter ? priorityCenter.innerHTML.length : 'missing');
      console.log('Goals panel content:', goalsPanel ? goalsPanel.innerHTML.length : 'missing');
    }, 2000);
  })
  .catch(err => console.error('Test failed:', err));
