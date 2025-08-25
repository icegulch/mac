// .eleventy.js (ESM, Eleventy v3+)
import "dotenv/config";
import { DateTime } from "luxon";
import slugify from "slugify";
import toml from "toml";
import CleanCSS from "clean-css";
import * as htmlmin from "html-minifier-terser";
import MarkdownIt from "markdown-it";

export default function (eleventyConfig) {
  const env = process.env.ELEVENTY_ENV;

  // Passthroughs
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/fonts/");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Remove YAML extension (we're not using js-yaml anymore)

  // Front matter: TOML support
  eleventyConfig.setFrontMatterParsingOptions({
    engines: { toml: toml.parse.bind(toml) },
  });

  // Markdown render filter
  const mdRender = new MarkdownIt();
  eleventyConfig.addFilter("renderUsingMarkdown", (raw) => mdRender.render(raw));

  // Slugify (custom)
  eleventyConfig.addFilter("slugify", (str) =>
    slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g,
    })
  );

  // Date filters
  eleventyConfig.addFilter("postDate", (d) =>
    DateTime.fromISO(d, { zone: "utc" }).toFormat("LLLL d, yyyy")
  );
  eleventyConfig.addFilter("shortDate", (d) =>
    DateTime.fromISO(d, { zone: "utc" }).toFormat("LLL-dd")
  );
  eleventyConfig.addFilter("gimmeYear", (d) =>
    DateTime.fromISO(d, { zone: "utc" }).toFormat("yyyy")
  );
  eleventyConfig.addFilter("htmlDateString", (d) =>
    DateTime.fromISO(d, { zone: "utc" }).toFormat("yyyy-LL-dd")
  );

  // Debug dump (Node util.inspect via dynamic import keeps top clean)
  eleventyConfig.addFilter("dump", async (obj) => {
    const util = await import("node:util");
    return util.default.inspect(obj);
  });

  // CSS minify
  eleventyConfig.addFilter("cssmin", (code) => new CleanCSS({}).minify(code).styles);

  // HTML minify (only in production)
  eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
    if (env === "production" && outputPath && outputPath.endsWith(".html")) {
      return await htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  // Deep merge is default in v3; no need to setDataDeepMerge(true)
  // passthroughFileCopy is no-op in v3

  return {
    dir: { input: "src", output: "public" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}