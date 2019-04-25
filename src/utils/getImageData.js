const metas = new WeakMap();

export default function getImageData(state, id) {
  const img = state.uploads[id].file;

  return getImageDataFromBlob(img);
}

export function getImageDataFromBlob(img) {
  if (metas.has(img)) {
    return metas.get(img);
  }

  const prom = new Promise((resolve, reject) => {
    const i = new Image();
    const url = URL.createObjectURL(img);
    i.onload = () => {
      resolve({
        image: i,
        width: i.naturalWidth,
        height: i.naturalHeight,
        url
      });
    };
    i.src = url;
  });

  metas.set(img, prom);
  return prom;
}
