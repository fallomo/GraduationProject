// let buf =Buffer.from('0x74657374');
// console.log(buf.toString('utf-8'))

function numFormat(num,bit) {
    let result = String(num).split("").reverse();
    let point = result.indexOf(".");

    // for (let i = point === -1 ? 3 : point + 4; i < result.length; i += 3) {
    //   result.splice(i, 0, ",");
    //   i++;
    // }
    let i = point === -1? bit : point + bit+1
    result.splice(i, 0, ".");
    return result.reverse().join("");
  }
  let num = 113374796
  console.log(numFormat(num,6))