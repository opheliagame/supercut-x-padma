const fs = require('fs')

async function deleteFile(filePath) {

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(`File ${filePath} has been deleted.`);
  });
}

module.exports = {
  deleteFile
}
