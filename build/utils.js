function extractVideoId(youtubeLink) {
  if (!youtubeLink) {
    console.log("youtubeLink is null or empty.");
    return null;
  }
  // Check if the link contains the video ID
  if (youtubeLink.includes("watch?v=")) {
    // Extract video ID from a full YouTube link
    const params = new URLSearchParams(new URL(youtubeLink).search);
    const videoId = params.get("v");
    return videoId;
  } else if (youtubeLink.includes("youtu.be/")) {
    // Extract video ID from a short YouTube link
    const parts = youtubeLink.split("/");
    const videoId = parts.pop();
    return videoId.split("?")[0]; // Remove any query parameters
  } else if (youtubeLink.includes("/live/")) {
    const index = youtubeLink.indexOf("/live/") + 6; // Adding 6 to skip "/live/"
    if (index > 0 && index < youtubeLink.length) {
      const videoId = youtubeLink.substring(index);
      return videoId.split("?")[0]; // Remove any query parameters
    }
  }
  // Return the input string as the video ID
  return youtubeLink;
}
function isValidId(id) {
  if (id.length !== 11) {
    return false;
  }
  const validCharacters = /^[a-zA-Z0-9_-]+$/;
  if (!validCharacters.test(id)) {
    return false;
  }
  return true;
}

// Export both functions
export { extractVideoId, isValidId };
