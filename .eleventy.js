const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const { DateTime } = require("luxon");
const _ = require("lodash");
const markdownFilter = require('./src/filters/markdown-filter.js');
const slugify = require("slugify");
require("dotenv").config();

module.exports = function (eleventyConfig) {

  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Let some files pass through to public
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/images/**");
  eleventyConfig.addPassthroughCopy("./src/mac-directions-with-profile.pdf");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy('./src/admin/config.yml');
  eleventyConfig.addPassthroughCopy('./src/admin/index.html');
  eleventyConfig.addPassthroughCopy('./src/admin/confirmation.html');
  eleventyConfig.addPassthroughCopy('./src/admin/email-change.html');
  eleventyConfig.addPassthroughCopy('./src/admin/invitation.html');
  eleventyConfig.addPassthroughCopy('./src/admin/recovery.html');

  // Support YML because JSON effs up dates
  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

  // Markdown, please
  eleventyConfig.addFilter('markdownFilter', markdownFilter);

  // Slugify
  eleventyConfig.addFilter("slugify", function (str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g
    });
  });

  // Debug
  eleventyConfig.addFilter("debugger", (...args) => {
    console.log(...args)
    debugger;
  })

  // Year only
  eleventyConfig.addFilter("gimmeYear", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("yyyy");
  });

  // Nice date for post-y type things
  eleventyConfig.addFilter("postDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL d, yyyy");
  });

  // Short date for results page
  eleventyConfig.addFilter("shortDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLL d");
  });

  // htmlDateString
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
     return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Helper to sort pages collection by frontmatter field "order"
  eleventyConfig.addCollection("orderedPages", function (collection) {
    return collection.getFilteredByTag("pages").sort((a, b) => {
      return a.data.order - b.data.order;
    });
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

  // deep merge
  eleventyConfig.setDataDeepMerge(true);

  return {
    addPassthroughCopy: true,
    templateFormats: ['md', 'njk', 'html'],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "public",
    },
  };
};
