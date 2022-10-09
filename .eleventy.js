const htmlmin = require("html-minifier");
const { DateTime } = require("luxon");
const slugify = require("slugify");
require("dotenv").config();
const util = require('util');
const toml = require("toml");
const CleanCSS = require("clean-css");


module.exports = function (eleventyConfig) {

  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Let some files pass through to public
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/fonts/");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

  eleventyConfig.setFrontMatterParsingOptions({
    engines: {
      toml: toml.parse.bind(toml)
    }
  });

  const MarkdownIt = require("markdown-it");
  const mdRender = new MarkdownIt();
  eleventyConfig.addFilter("renderUsingMarkdown", function(rawString) {
    return mdRender.render(rawString);
  });

  // Slugify
  eleventyConfig.addFilter("slugify", function (str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g
    });
  });

  // Nice date for post-y type things
  eleventyConfig.addFilter("postDate", dateObj => {
    return DateTime.fromISO(dateObj, {zone: 'utc'}).toFormat("LLLL d, yyyy");
  });

  // Short date for results page
  eleventyConfig.addFilter("shortDate", dateObj => {
    return DateTime.fromISO(dateObj, {zone: 'utc'}).toFormat("LLL-dd");
  });

  // Short date for results page
  eleventyConfig.addFilter("gimmeYear", dateObj => {
    return DateTime.fromISO(dateObj, {zone: 'utc'}).toFormat("yyyy");
  });

  // htmlDateString
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
     return DateTime.fromISO(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('dump', obj => {
      return util.inspect(obj)
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify HTML Output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if(process.env.ELEVENTY_ENV === 'production' && outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // hide 2020 results
  eleventyConfig.addCollection('resultsSans2020', function(collection) {
      return collection.getFilteredByTag("results")
          .filter((result) => result.data.year != 2020);
  });

  // deep merge
  eleventyConfig.setDataDeepMerge(true);

  return {
    dir: {
      input: "src",
      output: "public",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
