/* eslint-disable react/prop-types */

import { IProject, IRoadmapFeature, IRoadmapViewProps } from '../../interfaces'
import './Board.css'
import React = require('react')
import { IconButton, IIconProps, registerIcons } from '@fluentui/react'
import {
  CaretLeftSolid8Icon,
  CaretRightSolid8Icon
} from '@fluentui/react-icons-mdl2'
import { getDaysDifference, getWeekNumber } from '../../services/functions'

registerIcons({
  icons: {
    nextWeekIcon: <CaretRightSolid8Icon />,
    prevWeekIcon: <CaretLeftSolid8Icon />
  }
})
const nextWeekIcon: IIconProps = { iconName: 'nextWeekIcon' }
const prevWeekIcon: IIconProps = { iconName: 'prevWeekIcon' }
// features,
//   projects,
//   firstDay,
//   lastDay,
//   onChange
const Board: React.FC<IRoadmapViewProps> = (props) => {
  const [weekNumbers, setWeekNumbers] = React.useState<string[]>()
  const [firstDay, setFirstDay] = React.useState(props.firstDay)
  const [lastDay, setLastDay] = React.useState(props.lastDay)
  const [features, setFeatures] = React.useState<IRoadmapFeature[]>(
    props.features
  )
  const [projects, setProjects] = React.useState<IProject[]>([])

  const initializeComponent = () => {
    console.log('initializeComponent')
    console.log('features', features)
    console.log('props.features', props.features)

    const featureList: IRoadmapFeature[] = []
    props.features.forEach((f) => {
      console.log('f', f)
      console.log('firstDay', firstDay)
      console.log('lastDay', lastDay)
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
          status: f.status
        })
      }
    })
    featureList.sort(function (a, b) {
      return a.startDate.getTime() - b.startDate.getTime()
    })
    setFeatures(featureList)
    console.log('featureList', featureList)

    const projectList: IProject[] = []
    featureList.forEach((f) => {
      if (!projectList.some((x) => x.id === f.projectId))
        projectList.push({
          id: f.projectId,
          name: f.projectId
        })
    })
    setProjects(projectList)
  }

  const getInnerDivStyle = (
    date1: Date,
    date2: Date,
    calcFeatureDuration: boolean
  ) => {
    let d1 = date1
    let d2 = date2
    if (d1 < firstDay) d1 = firstDay
    if (d2 > lastDay) d2 = lastDay
    let flexVal = 0
    if (date1 < date2) flexVal = getDaysDifference(d1, d2)
    const outStyle: any = { flex: flexVal }
    if (calcFeatureDuration) {
      outStyle.backgroundColor = 'rgb(210,210,210)'
      outStyle.border = 'solid thin'
      outStyle.zIndex = '30'
      outStyle.display = 'flex'
      outStyle.flexDirection = 'row'
    }
    return outStyle
  }

  const getProjectDivStyle = (projectId: string, index: number) => {
    const n = features.filter((x) => x.projectId === projectId).length
    const h = n * 40 + 6
    const divStyle: any = {
      textAlign: 'center',
      height: `${h}px`
    }
    if (index % 2 === 0) divStyle.backgroundColor = 'rgb(240, 240, 240)'
    return divStyle
  }

  React.useEffect(() => {
    console.log('firstDay', firstDay)

    let weekNumber = getWeekNumber(firstDay)
    let weekNumberStr = String(weekNumber).padStart(2, '0')
    const weekNumberStrings = []
    for (let i = 0; i < 4; i++) {
      const str = `CW${weekNumberStr}`
      weekNumberStrings.push(str)
      weekNumber += 1
      weekNumberStr = String(weekNumber).padStart(2, '0')
    }
    setWeekNumbers(weekNumberStrings)
    initializeComponent()
    // props.onChange(firstDay)
  }, [firstDay])

  React.useEffect(() => {
    console.log('change feature', features)
    if (features !== props.features) {
      // initializeComponent()
      props.onChange(features, firstDay)
    }
  }, [features])

  React.useEffect(() => {
    console.log(
      'props.firstDay, props.features',
      'features',
      props.firstDay,
      props.features,
      features
    )

    if (features !== props.features) {
      console.log('props.features', props.features)
      setFeatures(props.features)
    }
    if (firstDay !== props.firstDay) {
      setFirstDay(props.firstDay)
      setLastDay(props.lastDay)
    }
    initializeComponent()
  }, [props.firstDay, props.features])

  // React.useEffect(() => {
  //   if (firstDayStat !== firstDay) {
  //     setFirstDayStat(firstDay)
  //   }
  // }, [firstDay])

  const changeWeek = (nextWeek: boolean) => {
    const first = new Date(firstDay)
    const last = new Date(lastDay)
    if (nextWeek) {
      first.setDate(first.getDate() + 7)
      last.setDate(last.getDate() + 7)
    } else {
      first.setDate(first.getDate() - 7)
      last.setDate(last.getDate() - 7)
    }
    console.log('firstDay', firstDay)
    console.log('prevWeekFirstDay', first)
    setFirstDay(first)
    setLastDay(last)
  }

  return (
    <div className="container">
      <div className="project-col">
        <div className="project-col-header">Projects</div>
        {projects.map((p, index) => (
          <div key={p.id} style={getProjectDivStyle(p.id, index)}>
            {p.name}
          </div>
        ))}
      </div>
      <div className="change-week-btn-div">
        <IconButton
          className="next-week-button"
          iconProps={prevWeekIcon}
          title="Previous Week "
          ariaLabel="Previous week"
          onClick={() => changeWeek(false)}
        />
      </div>
      <div className="roadmap-borad">
        <div className="week-board">
          {weekNumbers?.map((w) => (
            <div key={w} className="week-div">
              <span style={{ paddingLeft: '0.5em' }}>
                <b>{w}</b>
              </span>
              <div className="week-box">
                <div className="day-div">Mo.</div>
                <div className="day-div">Tu.</div>
                <div className="day-div">We.</div>
                <div className="day-div">Th.</div>
                <div className="day-div">Fr.</div>
                <div className="day-div">Sa.</div>
                <div className="day-div">Su.</div>
              </div>
            </div>
          ))}
        </div>
        <div className="feature-board">
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
                      {/* {element.name} */}
                    </div>
                    <div
                      key={`${element.id}-3`}
                      style={getInnerDivStyle(element.endDate, lastDay, false)}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="change-week-btn-div">
        <IconButton
          className="next-week-button"
          iconProps={nextWeekIcon}
          onClick={() => changeWeek(true)}
          title="Next Week"
          ariaLabel="next week"
        />
      </div>
    </div>
  )
}

export default Board
