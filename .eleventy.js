module.exports = function(eleventyConfig) {
  // Custom filters
  eleventyConfig.addFilter('nl2br', function(str) {
    return str ? String(str).replace(/\n/g, '<br>') : ''
  })

  // Pass through static assets unchanged
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({"src/uploads": "src/uploads"});
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  // Note: src/admin (Decap CMS) removed — using Sanity Studio instead

  // Watch CSS/JS for changes during development
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
