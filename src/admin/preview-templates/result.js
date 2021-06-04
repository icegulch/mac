import htm from "https://unpkg.com/htm?module";
import format from "https://unpkg.com/date-fns@2.7.0/esm/format/index.js?module";

const html = htm.bind(h);

// Preview component for a Result
const Result = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main>
        <h2>${entry.getIn(["data", "name"], null)}'s MAC Report</h2>
        <time
          >${
            format(
              entry.getIn(["data", "run_date"], new Date()),
              "MMM dd, yyyy"
            )
          }</time
        >
        <p>Result: ${entry.getIn(["data", "run_duration"], "")}</p>
        <ul>
          <li>
            ${
              entry.getIn(["data", "other_runners"], []).map(
                runner =>
                  html`
                    <a href="#">${runner}</a>
                  `
              )
            }
          </li>
        </ul>
        <article class="report-article">
          ${this.props.widgetFor("body")}
        </article>
      </main>
    `;
  }
});

export default Result;
