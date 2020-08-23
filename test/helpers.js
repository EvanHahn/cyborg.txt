// This is only used in tests and is not robust.
exports.parse = (str) => {
  const lines = str
    .split(/\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

  const result = {};
  let currentUserAgent = null;
  let currentDisallows = [];
  for (const line of lines) {
    if (line.startsWith("User-agent:")) {
      if (currentUserAgent) {
        result[currentUserAgent] = currentDisallows;
        currentDisallows = [];
      }
      currentUserAgent = line.replace("User-agent:", "").trim();
    } else if (line.startsWith("Disallow:")) {
      const disallow = line.replace("Disallow:", "").trim();
      if (disallow) {
        currentDisallows.push(disallow);
      }
    }
  }
  result[currentUserAgent] = currentDisallows;

  return result;
};
