exports.print = (text) => {
  process.stdout.clearLine();  // clear current text
  process.stdout.cursorTo(0);  // move cursor to beginning of line
  process.stdout.write(text);
}
exports.printLn = (text) => {
  process.stdout.write(text+"\n");
}