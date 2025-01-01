import styles from "./styles.module.scss";
import AddNewEvent from "./AddNewEvent";
import Select from "react-select";
import options from "./cases.json";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { useAppContext } from "./Context";

export default function TopBar({ filterTimelineData }) {
  const [filters, setFilters] = useImmer({});
  const { loadEvents } = useAppContext();

  useEffect(() => {
    filterTimelineData(filters);
  }, [filters]);

  return (
    <div className={styles.topbar}>
      <AddNewEvent loadEvents={loadEvents} btnClassName={styles.btn} />
      <Select
        value={
          filters.caseNumber
            ? options.find((op) => op.value === filters.caseNumber)
            : null
        }
        onChange={(e) => {
          setFilters((draft) => {
            if (!e?.value) {
              delete draft["caseNumber"];
              return;
            }
            draft["caseNumber"] = e.value;
          });
        }}
        options={options.map((item) => ({
          label: item.caseNumber,
          value: item.caseNumber,
        }))}
        className={styles.casesSelect}
        isClearable
        placeholder={"סינון לפי תיק"}
      />
    </div>
  );
}
