/* eslint-disable no-unused-vars */

import { IInputs, IOutputs } from './generated/ManifestTypes'
import * as React from 'react'
import { IRoadmapFeature, IRoadmapViewProps } from './interfaces'
import { getFirstandLastDays } from './services/functions'
import Board from './components/board/Board'

export class roadmap
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>
  private _context: ComponentFramework.Context<IInputs>
  private notifyOutputChanged: () => void

  private _props: IRoadmapViewProps = {
    features: [],
    firstDay: new Date(),
    lastDay: new Date(),
    onChange: this.notifyChange.bind(this)
  }

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    this._context = context
    this.notifyOutputChanged = notifyOutputChanged
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */

  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    const dataSet = this._context.parameters.dataSet
    const timePeriod = getFirstandLastDays(this._props.firstDay, true)
    let features: IRoadmapFeature[] = []

    dataSet.sortedRecordIds.forEach((id) => {
      features.push({
        id: String(dataSet.records[id].getValue('arades_roadmapfeatureid')),
        projectId: String(dataSet.records[id].getValue('Project')),
        projectName: String(dataSet.records[id].getValue('Project')),
        name: String(dataSet.records[id].getValue('_arades_featureid_value')),
        startDate: new Date(
          String(dataSet.records[id].getValue('arades_startdate'))
        ),
        endDate: new Date(
          String(dataSet.records[id].getValue('arades_enddate'))
        ),
        status: String(dataSet.records[id].getValue('Status_Reason')),
        progress: Number(dataSet.records[id].getValue('Progress'))
      })
    })
    features = features.filter((x) => x.id !== 'undefined')
    if (features.length === 0) {
      for (let i = 0; i < 10; i++) {
        const startDate = new Date(timePeriod.startDate)
        startDate.setDate(startDate.getDate() + i)
        const endDate = new Date(timePeriod.startDate)
        endDate.setDate(endDate.getDate() + i + 7)
        features.push({
          id: String(i),
          name: `Feature ${i}, Request second form "Notification of activity"`,
          status: '',
          projectId: String(i),
          projectName: `Project ${i} _ Project name`,
          startDate: startDate,
          endDate: endDate,
          progress: 0.35
        })
      }
    }

    this._props.features = features

    this._props.firstDay = timePeriod.startDate
    this._props.lastDay = timePeriod.endDate
    return React.createElement(Board, this._props)
  }

  private notifyChange(newFeatures: IRoadmapFeature[], newFirstDay: Date) {
    this._props.firstDay = newFirstDay
    this._props.features = newFeatures
    this.notifyOutputChanged()
  }
  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {}
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
