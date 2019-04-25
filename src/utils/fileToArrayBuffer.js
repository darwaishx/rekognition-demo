// AWS SDK should be able to take blobs, but webpack doesn't like it
export default function(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.readAsArrayBuffer(file);

    r.addEventListener('load', _ => {
      resolve(r.result);
    });

    r.addEventListener('error', _ => {
      reject();
    });
  });
}
