module.exports = function (eleventyConfig) {
  // Copy static assets directly to the output folder
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("header.js");
  eleventyConfig.addPassthroughCopy(".htaccess");

  eleventyConfig.setTemplateFormats(["njk", "html"]);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  };
};
