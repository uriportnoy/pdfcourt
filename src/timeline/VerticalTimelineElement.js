import styles from "./VerticalTimeline.module.scss";
import ItemMenu from "./components/ItemMenu";
import PDFViewer from "./components/PDFView";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { InView } from "react-intersection-observer";

const icons = {
  mine: "home",
  notMine: "directions",
  court: "hammer",
  "trd-party": "sparkles",
};

const VerticalTimelineElement = ({
  children = "",
  onTimelineElementClick = null,
  position = "",
  visible = false,
  shadowSize = "small", // small | medium | large
  item,
}) => {
  const menu = useRef(null);
  const {
    id,
    type,
    date,
    fileURL,
    relatedCases,
    relatedEvent,
    relatedDates,
    groups,
    selectedCase,
    caseNumber,
  } = item;

  return (
    <InView rootMargin="-40px 0px" threshold={0} triggerOnce>
      {({ inView, ref }) => (
        <div
          ref={ref}
          className={classNames(styles.wrapper, "vertical-timeline-element", {
            "vertical-timeline-element--left": position === "left",
            "vertical-timeline-element--right": position === "right",
            "vertical-timeline-element--no-children": children === "",
          })}
          data-origin={type}
          id={id}
        >
          <React.Fragment>
            <span // eslint-disable-line jsx-a11y/no-static-element-interactions
              className={classNames(
                styles.iconWrapper,
                "vertical-timeline-element-icon",
                `shadow-size-${shadowSize}`, // for shadow size
                {
                  "bounce-in": inView || visible,
                  "is-hidden": !(inView || visible),
                }
              )}
            >
              <span
                className={classNames(`pi pi-${icons[type]}`, styles.icon)}
                onClick={(event) => menu.current.toggle(event)}
              />
            </span>
            <div
              onClick={onTimelineElementClick}
              className={classNames(
                styles.content,
                "vertical-timeline-element-content",
                {
                  "bounce-in": inView || visible,
                  "is-hidden": !(inView || visible),
                }
              )}
            >
              <div
                className={classNames(
                  styles.contentArrowStyle,
                  "vertical-timeline-element-content-arrow"
                )}
              />
              <ItemMenu ref={menu} {...item} />
              {children}
              <PDFViewer fileURL={fileURL} />
              <span
                className={classNames(
                  styles.dateClassName,
                  "vertical-timeline-element-date"
                )}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "2em",
                  }}
                >
                  {getDate(date)}
                </span>
                <span className={styles.caseNumber}>
                  {selectedCase.type} {caseNumber}
                </span>
                {relatedCases && (
                  <div className={styles.relatedCases}>
                    {relatedCases.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                )}
                {relatedDates && (
                  <div className={styles.relatedCases}>
                    {relatedDates.map((_d) => (
                      <span key={`date_${_d}`}>{_d}</span>
                    ))}
                  </div>
                )}
                {groups && (
                  <div className={styles.group}>
                    {groups.map((_d, idx) => (
                      <span key={`${idx}_${_d.label}`}>{_d.label}</span>
                    ))}
                  </div>
                )}
                {relatedEvent && (
                  <div className={styles.relatedEvent}>
                    <span>{relatedEvent}</span>
                  </div>
                )}
              </span>
            </div>
          </React.Fragment>
        </div>
      )}
    </InView>
  );
};

function getDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getUTCDate(); // UTC day
  const month = date.getUTCMonth() + 1; // Months are 0-based
  const year = date.getUTCFullYear();
  const formattedDate = `${String(day).padStart(2, "0")}/${String(
    month
  ).padStart(2, "0")}/${year}`;
  return formattedDate;
}

VerticalTimelineElement.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onTimelineElementClick: PropTypes.func,
  position: PropTypes.string,
  visible: PropTypes.bool,
  shadowSize: PropTypes.string,
};

export default VerticalTimelineElement;
