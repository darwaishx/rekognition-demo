import rateLimited from './rateLimited';

// not sure exactly how necessary the concurrency limit is here but it seems to help a bit
export default rateLimited(5, function uploadFileToUrl(url, file, progressCallback= ()=>{}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.onload = () => {
      resolve();
    };

    xhr.onerror = er => {
      console.log(xhr);
      reject(er);
    };

    if (xhr.upload) {
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          progressCallback(e.loaded / e.total);
        }
      };
    }

    xhr.send(file);
  });
});
