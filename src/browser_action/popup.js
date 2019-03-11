async function getList() {
  try {
    const items = await chrome.storage.local.get('list');
    return JSON.parse(items['list']);
  }
  catch {
    return [];
  }
}

async function addToList(url) {
  let list = await getList();
  listSet = new Set(list);
  listSet.add(url);
  await chrome.storage.local.set({
    'list': JSON.stringify(Array.from(listSet)),
  });
}

async function renderList(containerId) {
  const container = document.getElementById(containerId);

  // Reset
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  } 

  const list = await getList();
  for (const url of list) {
    var listItem = document.createElement('li');
    var listLink = document.createElement('a');
    listLink.href = url;
    listLink.textContent = url;
    listLink.target = '_blank';
    listItem.appendChild(listLink);
    container.appendChild(listItem);
  }
}

async function main() {
  document.addEventListener('DOMContentLoaded', function(){
    renderList('linkList');

    const addButton = document.getElementById('addCurrentTab');
    addButton.addEventListener('click', async function(event){
      const tabs = await chrome.tabs.query({'active': true, 'currentWindow': true});
      const url = tabs[0].url;
      addToList(url);
      renderList('linkList');
    });
  })
}

main()
