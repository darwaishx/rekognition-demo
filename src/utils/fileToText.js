export default function(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.readAsText(file);

    r.addEventListener('load', _ => {
      resolve(r.result);
    });

    r.addEventListener('error', _ => {
      reject();
    });
  });
}
