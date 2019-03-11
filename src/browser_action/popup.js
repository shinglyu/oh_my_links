async function getList() {
  try {
    const items = await chrome.storage.local.get('list');
    return new Set(items['list']);
  }
  catch {
    return new Set([]);
  }
}

async function addToList(url) {
  let list = await getList();
  list.add(url);
  
  await chrome.storage.local.set({
    'list': JSON.stringify(list),
  });
}

async function main() {
  document.addEventListener('DOMContentLoaded', function(){
    const addButton = document.getElementById('addCurrentTab');
    addButton.addEventListener('click', async function(event){
      const tabs = await chrome.tabs.query({'active': true, 'currentWindow': true});
      const url = tabs[0].url;
      alert(url);
    });
  })
}

main()
