function generateSlug(input) {
    const slug = input.toLowerCase().replace(/\s+/g, '-');
    return slug;
  }

module.exports = { generateSlug }