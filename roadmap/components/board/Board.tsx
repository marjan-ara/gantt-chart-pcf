/* eslint-disable react/prop-types */

import { IRoadmapFeature, IRoadmapViewProps } from '../../interfaces'
import './Board.css'
import React = require('react')
import {
  CommandBarButton,
  IconButton,
  IIconProps,
  registerIcons
} from '@fluentui/react'
import {
  CaretLeftSolid8Icon,
  CaretRightSolid8Icon
} from '@fluentui/react-icons-mdl2'
import {
  getDaysDifference,
  getFirstandLastDays,
  getWeekNumber
} from '../../services/functions'

registerIcons({
  icons: {
    nextWeekIcon: <CaretRightSolid8Icon />,
    prevWeekIcon: <CaretLeftSolid8Icon />
  }
})
const nextWeekIcon: IIconProps = { iconName: 'nextWeekIcon' }
const prevWeekIcon: IIconProps = { iconName: 'prevWeekIcon' }
const Board: React.FC<IRoadmapViewProps> = (props) => {
  const monthNames = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.'
  ]
  const [weekOrMonthNames, setWeekOrMonthNames] = React.useState<string[]>()
  const [firstDay, setFirstDay] = React.useState(props.firstDay)
  const [lastDay, setLastDay] = React.useState(props.lastDay)
  const [features, setFeatures] = React.useState<IRoadmapFeature[]>(
    props.features
  )
  // const [projects, setProjects] = React.useState<IProject[]>([])
  const [weekDays, setWeekDays] = React.useState<Date[]>([])
  const [weekView, setWeekView] = React.useState(true)

  const initializeComponent = () => {
    const featureList: IRoadmapFeature[] = []
    props.features.forEach((f) => {
      if (
        (f.startDate >= firstDay && f.startDate <= lastDay) ||
        (f.endDate >= firstDay && f.endDate <= lastDay)
      ) {
        featureList.push({
          id: f.id,
          projectId: f.projectId,
          projectName: f.projectName,
          name: f.name,
          startDate: f.startDate,
          endDate: f.endDate,
          status: f.status,
          progress: f.progress
        })
      }
    })
    featureList.sort(function (a, b) {
      return a.startDate.getTime() - b.startDate.getTime()
    })
    setFeatures(featureList)
    // const projectList: IProject[] = []
    // featureList.forEach((f) => {
    //   if (!projectList.some((x) => x.id === f.projectId))
    //     projectList.push({
    //       id: f.projectId,
    //       name: f.projectId
    //     })
    // })
    // setProjects(projectList)
  }

  const getInnerDivStyle = (
    date1: Date,
    date2: Date,
    calcFeatureDuration: boolean,
    progress: number
  ) => {
    // if (calcFeatureDuration) {
    console.log(
      'firstDay:',
      firstDay,
      'lastDay:',
      lastDay,
      'date1',
      date1,
      'date2',
      date2
    )

    // }
    let d1 = date1
    let d2 = date2
    if (d1 < firstDay) d1 = firstDay
    if (d2 > lastDay) d2 = lastDay
    // if (calcFeatureDuration) {
    //   console.log('d1', d1)
    //   console.log('d2', d2)
    // }
    let flexVal = 0
    if (date1 < date2) flexVal = getDaysDifference(d1, d2)
    // console.log('flexVal', flexVal)
    const outStyle: any = {
      flex: flexVal
    }
    if (calcFeatureDuration) {
      outStyle.backgroundColor = 'rgb(210,210,210)'
      outStyle.textAlign = 'center'
      outStyle.alignItems = 'center'
      outStyle.justifyContent = 'center'
      outStyle.zIndex = '30'
      outStyle.display = 'flex'
      outStyle.flexDirection = 'row'
      outStyle.marginTop = '0.6em'
      outStyle.marginBottom = '0.6em'
      outStyle.whiteSpace = 'pre-wrap'
      outStyle.overflow = 'hidden'
      outStyle.textOverflow = 'ellipsis'
      outStyle.fontSize = '0.8em'
      outStyle.background = `linear-gradient(90deg, rgb(0,142,200) ${
        progress * 100
      }%,rgb(101,198,219) ${progress * 100}%)`
    }
    return outStyle
  }

  // const getProjectDivStyle = (projectId: string) => {
  //   const n = features.filter((x) => x.projectId === projectId).length
  //   const h = n * 3
  //   const divStyle: any = {
  //     color: 'rgb(0,142,200)',
  //     display: 'flex',
  //     alignItems: 'center',
  //     fontWeight: 'bold',
  //     width: '100%',
  //     textAlign: 'left',
  //     height: `${h}em`,
  //     paddingLeft: '0.3em',
  //     boxSizing: 'border-box',
  //     borderBottom: 'solid thin rgb(220, 220, 220)'
  //   }
  //   // if (index % 2 === 0) divStyle.backgroundColor = 'rgb(230,250,255)'
  //   // else divStyle.backgroundColor = 'rgb(175,230,255)'
  //   return divStyle
  // }

  React.useEffect(() => {
    const nameStrings = []
    if (weekView) {
      let weekNumber = getWeekNumber(firstDay)
      let weekNumberStr = String(weekNumber).padStart(2, '0')
      for (let i = 0; i < 3; i++) {
        const str = `CW${weekNumberStr}`
        nameStrings.push(str)
        weekNumber += 1
        weekNumberStr = String(weekNumber).padStart(2, '0')
      }
      setWeekOrMonthNames(nameStrings)
    } else {
      for (let i = 0; i < 3; i++) {
        const day = new Date(firstDay)
        const str = monthNames[day.getMonth() + i]
        nameStrings.push(str)
      }
      setWeekOrMonthNames(nameStrings)
    }

    const days = []
    const dayCounts = getDaysDifference(firstDay, lastDay)
    for (let i = 0; i < dayCounts; i++) {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() + i)
      days.push(date)
    }
    console.log('first Day', firstDay, 'last day', lastDay)

    setWeekDays(days)
    initializeComponent()
  }, [firstDay])

  React.useEffect(() => {
    let timePeriod: any = {}
    if (weekView) {
      timePeriod = getFirstandLastDays(new Date(), true)
    } else {
      timePeriod = getFirstandLastDays(new Date(), false)
    }
    console.log('timePeriod', timePeriod)
    setFirstDay(timePeriod.startDate)
    setLastDay(timePeriod.endDate)
  }, [weekView])

  React.useEffect(() => {
    console.log('features', features)
    if (features !== props.features) {
      props.onChange(features, firstDay)
    }
  }, [features])

  React.useEffect(() => {
    if (features !== props.features) {
      setWeekView(true)
      setFeatures(props.features)
    }
    if (firstDay !== props.firstDay) {
      setFirstDay(props.firstDay)
      setLastDay(props.lastDay)
    }
    initializeComponent()
  }, [props.firstDay, props.features])

  const changeWeekOrMonth = (next: boolean) => {
    const first = new Date(firstDay)
    const last = new Date(lastDay)
    if (weekView) {
      if (next) {
        first.setDate(first.getDate() + 7)
        last.setDate(last.getDate() + 7)
      } else {
        first.setDate(first.getDate() - 7)
        last.setDate(last.getDate() - 7)
      }
    } else {
      if (next) {
        first.setMonth(first.getMonth() + 1, 1)
        last.setMonth(last.getMonth() + 1)
      } else {
        first.setMonth(first.getMonth() - 1, 1)
        last.setMonth(last.getMonth() - 1)
      }
    }
    console.log('first:', first, 'last:', last)
    setFirstDay(first)
    setLastDay(last)
  }

  return (
    <div className="container">
      <div className="roadmap-borad">
        <div className="option-board">
          <CommandBarButton
            className="option-btn"
            text="Week View"
            onClick={() => setWeekView(true)}
          />
          <CommandBarButton
            className="option-btn"
            text="Month View"
            style={{ marginRight: '30px' }}
            onClick={() => setWeekView(false)}
          />
        </div>
        <div className="main-board">
          <div className="feature-info-div">
            {/* <div className="project-col">
              <div
                className="board-row"
                style={{ borderBottom: 'solid thin rgb(230,230,230)' }}>
                <div className="feature-info-div-title">Project</div>
              </div>
              {projects.map((p) => (
                <div key={p.id} style={getProjectDivStyle(p.id)}>
                  {p.name}
                </div>
              ))}
            </div> */}
            <div className="feature-col">
              <div
                className="board-row"
                style={{ borderBottom: 'solid thin rgb(230,230,230)' }}>
                <div className="feature-info-div-title right-bordered-cell">
                  Project
                </div>
                <div className="feature-info-div-title right-bordered-cell">
                  Feature
                </div>
                <div className="feature-info-div-title right-bordered-cell">
                  Start
                </div>
                <div className="feature-info-div-title">End</div>
              </div>
              {features.map((f, index) => (
                <div
                  key={`title-${f.id}`}
                  className="board-row"
                  style={
                    index % 2 === 1
                      ? { backgroundColor: 'rgb(245,245,245)' }
                      : { backgroundColor: 'white' }
                  }>
                  <div
                    className="feature-info-div-column"
                    style={{ color: 'rgb(0,142,200)' }}>
                    {f.projectName}
                  </div>
                  <div
                    className="feature-info-div-column"
                    style={{ color: 'rgb(0,142,200)' }}>
                    {f.name}
                  </div>
                  <div className="feature-info-div-column">{`${
                    f.startDate.toISOString().split('T')[0]
                  }`}</div>
                  <div className="feature-info-div-column">{`${
                    f.endDate.toISOString().split('T')[0]
                  }`}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="change-week-btn-div">
            <IconButton
              className="next-week-button"
              iconProps={prevWeekIcon}
              title="Previous Week "
              ariaLabel="Previous week"
              onClick={() => changeWeekOrMonth(false)}
            />
          </div>
          <div className="date-info-div">
            <div className="week-board">
              {weekOrMonthNames?.map((item, index) => (
                <div
                  key={item}
                  className="week-div"
                  style={
                    index === weekOrMonthNames.length - 1
                      ? { borderRight: 'solid thin rgb(160, 160, 160)' }
                      : {}
                  }>
                  {!weekView && <div className="month-title">{item}</div>}
                </div>
              ))}
            </div>
            <div className="board-row">
              {weekView
                ? weekDays.map((day, index) => (
                    <div key={String(day)} className="date-cell">
                      {index === 0 || day.getDate() === 1 ? (
                        <>
                          {monthNames[day.getMonth()]}
                          <br />
                        </>
                      ) : (
                        ''
                      )}

                      {day.getDate()}
                    </div>
                  ))
                : ''}
            </div>
            {features.map((f, index) => (
              <div
                key={f.id}
                className="board-row"
                style={
                  index % 2 === 1
                    ? { backgroundColor: 'rgb(245,245,245)' }
                    : { backgroundColor: 'white' }
                }>
                {weekView &&
                  weekDays.map((item, ind) => (
                    <div key={`${index}-${ind}`} className="date-cell"></div>
                  ))}
              </div>
            ))}
            <div className="feature-board">
              {features.map((element) => (
                <div key={`f-${element.id}`} className="board-row">
                  <div
                    key={`${element.id}-1`}
                    style={getInnerDivStyle(
                      firstDay,
                      element.startDate,
                      false,
                      0
                    )}
                  />
                  <div
                    key={`${element.id}-2`}
                    style={getInnerDivStyle(
                      element.startDate,
                      element.endDate,
                      true,
                      element.progress
                    )}>
                    {element.name}
                  </div>

                  <div
                    key={`${element.id}-3`}
                    style={getInnerDivStyle(element.endDate, lastDay, false, 0)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="change-week-btn-div">
            <IconButton
              className="next-week-button"
              iconProps={nextWeekIcon}
              onClick={() => changeWeekOrMonth(true)}
              title="Next Week"
              ariaLabel="next week"
            />
          </div>
        </div>

        {/* <div className="feature-board">
          {projects.map((p, index) => (
            <div
              key={p.id}
              style={
                index % 2 === 0
                  ? {
                      width: '100%',
                      padding: '3px',
                      backgroundColor: 'rgb(240, 240, 240)'
                    }
                  : { width: '100%', padding: '3px' }
              }>
              {features
                .filter((x) => x.projectId === p.id)
                .map((element) => (
                  <div key={element.id} className="roadmap-row">
                    <div
                      key={`${element.id}-1`}
                      style={getInnerDivStyle(
                        firstDay,
                        element.startDate,
                        false
                      )}
                    />
                    <div
                      key={`${element.id}-2`}
                      style={getInnerDivStyle(
                        element.startDate,
                        element.endDate,
                        true
                      )}>
                      <div className="feature-name-div">
                        {`Feature: ${element.name}`}
                        <br />
                        {`Status: ${element.status}`}
                      </div>
                      <div className="feature-date-div ">
                        {`StartDate: ${
                          element.startDate.toISOString().split('T')[0]
                        }`}
                        <br />
                        {`EndDate: ${
                          element.endDate.toISOString().split('T')[0]
                        }`}
                      </div>
                    </div>
                    <div
                      key={`${element.id}-3`}
                      style={getInnerDivStyle(element.endDate, lastDay, false)}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div> */}
      </div>
      {/* <div className="change-week-btn-div">
        <IconButton
          className="next-week-button"
          iconProps={nextWeekIcon}
          onClick={() => changeWeek(true)}
          title="Next Week"
          ariaLabel="next week"
        />
      </div> */}
    </div>
  )
}

export default Board
