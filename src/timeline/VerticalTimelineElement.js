import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { InView } from "react-intersection-observer";
import styles from "./VerticalTimeline.module.scss";
import ItemMenu from "./ItemMenu";
import PDFViewer from "./PDFViewer";

const icons = {
  mine: "./logo.png",
  notMine: "./logo.png",
  court: "hammer",
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
  const { type, date, caseNumber, fileURL } = item;

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
                },
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
                },
              )}
            >
              <div
                className={classNames(
                  styles.contentArrowStyle,
                  "vertical-timeline-element-content-arrow",
                )}
              />
              <ItemMenu ref={menu} {...item} />
              {children}
              {fileURL && (
                <a href={fileURL} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              )}
              {/*{fileURL && <PDFViewer fileURL={fileURL} />}*/}
              {fileURL && (
                <object
                  data={fileURL}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p>
                    Alternative text - include a link{" "}
                    <a href={fileURL}>to the PDF!</a>
                  </p>
                </object>
              )}
              <span
                className={classNames(
                  styles.dateClassName,
                  "vertical-timeline-element-date",
                )}
              >
                <span>{getDate(date)}</span>
                <span className="caseNumber">{caseNumber}</span>
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
  const formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
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
