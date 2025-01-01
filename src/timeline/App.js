import "react-vertical-timeline-component/style.min.css";
import VerticalTimeline from "./VerticalTimeline";
import VerticalTimelineElement from "./VerticalTimelineElement";
import styles from "./styles.module.scss";
import { useCallback, useEffect, useState } from "react";
import AddNewEvent from "./AddNewEvent";
import "./firebase";
import { getEvents } from "./firebase/events";
import { Provider } from "./Context";

export default function () {
  const [timelineData, setTimelineData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadEvents = useCallback(() => {
    getEvents()
      .then(setTimelineData)
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <Provider value={{ loadEvents }}>
      <div className={styles.app}>
        <AddNewEvent loadEvents={loadEvents} />
        <VerticalTimeline>
          {timelineData.map((item) => {
            return (
              <VerticalTimelineElement key={item.title + item.date} item={item}>
                <h3 className="vertical-timeline-element-title">
                  {item.title}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {item.subtitle}
                </h4>
                <p>{item.content}</p>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </Provider>
  );
}
