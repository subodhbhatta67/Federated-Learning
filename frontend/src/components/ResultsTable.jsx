// ResultsTable.jsx — final-round numbers for each strategy in the response.
import { getFinalRow, formatMetric } from "../utils/results.js";

export default function ResultsTable({ results }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Strategy</th>
            <th scope="col">Final accuracy</th>
            <th scope="col">Final loss</th>
            <th scope="col">Final JFI</th>
            <th scope="col">Worst-client accuracy</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => {
            const last = getFinalRow(item) || {};
            return (
              <tr key={item.strategy}>
                <th scope="row">{item.strategy}</th>
                <td>{formatMetric("accuracy", last.accuracy)}</td>
                <td>{formatMetric("loss", last.loss)}</td>
                <td>{formatMetric("jfi", last.jfi)}</td>
                <td>{formatMetric("worst_client_acc", last.worst_client_acc)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
