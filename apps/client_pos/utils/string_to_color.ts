import md5 from "md5";

export default function stringToColor(input: string): string {
  // return "green";
  // TODO: this method is too costly to run every render
  // Calculate the MD5 hash of the input string
  const hash = md5(input);

  // Take the first 6 characters of the hash and convert them to a color
  const color = `#${hash.substr(0, 6)}`;

  return color;
}
