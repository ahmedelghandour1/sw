const dbPromise = idb.open('feed-store', 1, (upgradeDb) => {
    if (!upgradeDb.objectStoreNames.contains('posts')) {
        upgradeDb.createObjectStore('posts', { keyPath: 'id' })
    }
    if (!upgradeDb.objectStoreNames.contains('sync-posts')) {
        upgradeDb.createObjectStore('sync-posts', { keyPath: 'id' })
    }
});

const accessDbWithStore = async (storeName, mode) => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    return { db, tx, store };
}

const writeDbData = async (storeName, data) => {
    const { store, tx } = await accessDbWithStore(storeName, 'readwrite')
    store.put(data);
    return tx.complete;
}



const readBbData = async (storeName) => {
    const { store } = await accessDbWithStore(storeName, 'readonly')
    return store.getAll();
}


const clearAlldbData = async (storeName) => {
    const { store, tx } = await accessDbWithStore(storeName, 'readwrite')
    store.clear();
    return tx.complete;

}
const clearSingledbData = async (storeName, id) => {
    const { store, tx } = await accessDbWithStore(storeName, 'readwrite')
    store.delete(id)
    return tx.complete;
}

const getAllStoreKeys = async (storeName) => {
    const { store, tx } = await accessDbWithStore(storeName, 'readwrite')
    return store.getAllKeys();
}
