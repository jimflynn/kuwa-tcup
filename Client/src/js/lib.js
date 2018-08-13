/**
 * Export formatted JSON to keystore file.
 * @param {Object} keyObject Keystore object.
 * @param {string=} keystore Path to keystore folder (default: "keystore").
 * @param {function=} cb Callback function (optional).
 * @return {string} JSON filename (Node.js) or JSON string (browser).
 */
const exportToFile = async function (keyObject, keystore) {
    let outfile, outpath, json;
    json = JSON.stringify(keyObject);
    let blob = new Blob([json], {type : 'application/json'});
    
    await saveFile(keystore, keyObject.address, blob);
}

const saveFile = async function(filePath, fileName, fileBlob) {
    let resolveLocalFileSystemUtil = new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(filePath, successOnFile, null)
        function successOnFile(directoryEntry) {
            
            directoryEntry.getFile(fileName, {create:true}, file => resolve(file));
        }
    });
    let file = await resolveLocalFileSystemUtil;

    let writeFile = new Promise((resolve, reject) => {
        file.createWriter(fileWriter => {
            fileWriter.onwriteend = e => {
                resolve();
            }
            fileWriter.write(fileBlob);
        });
    });
    await writeFile;
}

// var importFromFile = async function() {

// }

const loadFile = async function(filePath, fileName) {
    let resolveLocalFileSystemUtil = new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(filePath + fileName, successOnFile, failOnFile)
        function successOnFile(fileEntry) {
          fileEntry.file(file => resolve(file));
        }
        function failOnFile() {
            reject(false);
        }
      });
      let file = await resolveLocalFileSystemUtil;
      if(!file) return false;

      let reader = new FileReader();
      let loadFile = new Promise((resolve, reject) => {
        reader.onloadend = e => {
          let fileBlob = new Blob([reader.result], { type:file.type});
          resolve(fileBlob);
        }
      });
      reader.readAsArrayBuffer(file);
      return await loadFile;
}

export { exportToFile, saveFile, loadFile };