export default function parseCSV(text, columnSeparator = ',', lineSeparator = '\n') {
  let lines = [];
  let lIdx = 0;
  let line = lines[0] = [];

  text = text.replace(/\r(?!\n)/g, '\n').replace(/\r?\n/g, '\n').replace(/\s+$/, '');

  let cStart = 0, idx, ii = 0, len = text.length;
  outer: while (cStart < len) {
    if (text.charAt(cStart) === '"') {
      for (idx = cStart + 1; idx < len; idx++) {
        if (text.charAt(idx) === '"') {
          if (idx === len - 1) {
            line[ii++] = text.slice(cStart + 1, len - 1);
            break outer;
          } else if (text.charAt(idx + 1) === lineSeparator) {
            line[ii++] = text.slice(cStart + 1, idx);
            line = lines[++lIdx] = [];
            ii = 0;
            cStart = idx + 2;
            continue outer;
          } else if (text.charAt(idx + 1) === columnSeparator) {
            line[ii++] = text.slice(cStart + 1, idx);
            cStart = idx + 2;
            continue outer;
          }
        }
      }
      line[ii++] = text.slice(cStart + 1);
      break;
    } else {
      for (idx = cStart; idx < len; idx++) {
        if (text.charAt(idx) === columnSeparator) {
          line[ii++] = text.slice(cStart, idx);
          cStart = idx + 1;
          continue outer;
        } else if (text.charAt(idx) === lineSeparator) {
          line[ii++] = text.slice(cStart, idx);
          cStart = idx + 1;
          line = lines[++lIdx] = [];
          ii = 0;
          continue outer;
        }
      }
      line[ii++] = text.slice(cStart);
      break;
    }
  }

  return lines;
}
