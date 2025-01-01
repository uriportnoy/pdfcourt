import "../style.css";
import VerticalTimeline from "./VerticalTimeline";
import VerticalTimelineElement from "./VerticalTimelineElement";
import styles from "./styles.module.scss";
import { useCallback, useEffect, useState } from "react";
import "./firebase";
import Center from "../Center";
import { Provider } from "./Context";
import TopBar from "./components/TopBar";
import { getAllCases } from "./firebase/cases";
import { getAll } from "./firebase/crud";
import { getEvents } from "./firebase/events";

function TimelineApp() {
  const [allEvents, setAllEvents] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cases, setCases] = useState([]);
  const [groups, setGroups] = useState([]);

  const loadEvents = useCallback(async () => {
    const _events = await getEvents();
    setAllEvents(_events);
    setTimelineData(_events);
  }, []);

  const loadCases = useCallback(async () => {
    const _cases = await getAllCases();
    setCases(_cases);
    return _cases;
  }, []);

  const loadGroups = useCallback(async () => {
    const _groups = await getAll("groups");
    console.log("groups:", _groups);
    setGroups(_groups);
  }, []);

  const filterTimelineData = (filterObj) => {
    if (!filterObj || Object.keys(filterObj).length === 0) {
      return setTimelineData(allEvents); // Reset to all events when no filters are applied
    }

    const filteredData = allEvents.filter((item) => {
      return Object.entries(filterObj).every(([key, value]) => {
        if (key === "text") {
          if (!value || value.length <= 2) return true;
          const {
            title = "",
            content = "",
            caseNumber = "",
            subTitle = "",
          } = item;
          return (
            title.toLowerCase().includes(value.toLowerCase()) ||
            content.toLowerCase().includes(value.toLowerCase()) ||
            caseNumber.toLowerCase().includes(value.toLowerCase()) ||
            subTitle.toLowerCase().includes(value.toLowerCase())
          );
        }

        if (key === "groups" && item[key]) {
          const groupArray = Array.isArray(item[key]) ? item[key] : [item[key]];
          return groupArray.some((group) => {
            const groupValue =
              group.value?.value?.value || group.value?.value || group.value;
            return groupValue === value;
          });
        }

        // Handle general array or scalar filtering
        if (Array.isArray(item[key])) {
          return item[key].some((innerItem) => innerItem.value === value);
        }

        return item[key] === value;
      });
    });

    console.log(filteredData);
    setTimelineData(filteredData);
  };
  useEffect(() => {
    Promise.all([loadEvents(), loadCases(), loadGroups()]).then(() => {
      setIsLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded) {
    return <Center>Loading...</Center>;
  }

  return (
    <Provider value={{ loadEvents, allEvents, cases, groups, loadCases }}>
      <div className={styles.app}>
        <TopBar filterTimelineData={filterTimelineData} />
        <VerticalTimeline>
          {timelineData.map((item) => {
            return (
              <VerticalTimelineElement key={item.title + item.date} item={item}>
                <div className={styles.contentWrapper}>
                  <h3 className="vertical-timeline-element-title">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <h4 className="vertical-timeline-element-subtitle">
                      {item.subtitle}
                    </h4>
                  )}
                  {item.description && <p>{item.description}</p>}
                  <div
                    dangerouslySetInnerHTML={{ __html: item.content }}
                    className={styles.content}
                  />
                </div>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </Provider>
  );
}

export default TimelineApp;
