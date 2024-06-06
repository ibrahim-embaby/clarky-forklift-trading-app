export default function limitText(text, limit) {
  return text.length > limit ? text.substr(0, limit).concat("...") : text;
}
