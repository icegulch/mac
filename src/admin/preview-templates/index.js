import Result from "/admin/preview-templates/result.js";
// import Page from "/admin/preview-templates/page.js";

// Register the Result component as the preview for entries in the results collection
CMS.registerPreviewTemplate("results", Result);
// CMS.registerPreviewTemplate("pages", Page);

CMS.registerPreviewStyle("/_includes/assets/css/styles.css");
// Register any CSS file on the home page as a preview style
fetch("/")
  .then(response => response.text())
  .then(html => {
    const f = document.createElement("html");
    f.innerHTML = html;
    Array.from(f.getElementsByTagName("link")).forEach(tag => {
      if (tag.rel == "stylesheet" && !tag.media) {
        CMS.registerPreviewStyle(tag.href);
      }
    });
  });


var ArrayControl = createClass({
  handleChange: function (e) {
    const separator = this.props.field.get("separator", ", ");
    this.props.onChange(e.target.value.split(separator));
  },

  render: function () {
    const separator = this.props.field.get("separator", ", ");
    var value = this.props.value;
    return h("input", {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: "text",
      value: value ? value.join(separator) : "",
      onChange: this.handleChange,
    });
  },
});

var ArrayPreview = createClass({
  render: function () {
    return h(
      "ul",
      {},
      this.props.value.map(function (val, index) {
        return h("li", { key: index }, val);
      })
    );
  },
});

var schema = {
  properties: {
    separator: { type: "string" },
  },
};
CMS.registerWidget("array", ArrayControl, ArrayPreview, schema);

CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    if (entry.get('collection') === 'results') {
      const runDate = new Date(entry.getIn(['data', 'run_date'], ''));
      const year_please = runDate.getFullYear();
      return entry.get('data').set('year', year_please).set('date', runDate);
    }
  },
});
