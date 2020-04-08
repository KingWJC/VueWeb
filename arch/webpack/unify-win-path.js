// convert git bash path into a standard window path
// e.g.
//
// /f/arch-new
//  becomes F:\arch-new
//
// E|e:/documents/product/ruixin-fe
//  becomes E:\documents\product\ruixin-fe
export default function(str) {
  // format: /f/arch-new
  if (/^\/[a-zA-Z]\//.test(str)) {
    str = str.substr(1, 1).toUpperCase() + ":" + str.substr(2);
    str = str.replace(/\//g, "\\");
  } else if (/^[a-zA-Z]:\//.test(str)) {
    // else: E|e:/documents/product/ruixin-fe
    str = str.substr(0, 1).toUpperCase() + str.substr(1);
    str = str.replace(/\//g, "\\");
  } else if (/^[a-zA-Z]:\\/.test(str)) {
    // else: E|e:\documents\product\ruixin-fe
    str = str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  return str;
}
