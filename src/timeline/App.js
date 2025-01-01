import "react-vertical-timeline-component/style.min.css";
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
  }, []);

  const loadGroups = useCallback(async () => {
    const _groups = await getAll("groups");
    console.log("groups:", _groups);
    setGroups(_groups);
  }, []);

  const filterTimelineData = (filterObj) => {
    if (!filterObj || Object.keys(filterObj).length === 0) {
      return setTimelineData(allEvents);
    }
    console.log(filterObj);
    setTimelineData(
      allEvents.filter((item) => {
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
            const kkk = Array.isArray(item[key]) ? item[key] : [item[key]];
            const ids = kkk.map((group) =>
              group.value?.value ? group.value?.value : group.value
            );
            return ids.includes(value);
          }
          return Array.isArray(item[key])
            ? !!item[key].find((item) => item.value === value)
            : item[key] === value;
        });
      })
    );
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
    <Provider value={{ loadEvents, allEvents, cases, groups }}>
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
