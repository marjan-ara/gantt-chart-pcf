export interface ITimePeriod {
  startDate: Date
  endDate: Date
}

export interface IRoadmapFeature {
  id: string
  projectId: string
  projectName: string
  name: string
  startDate: Date
  endDate: Date
  status: string
  progress: number
}
export interface IProject {
  id: string
  name: string
}
export interface IRoadmapViewProps {
  features: IRoadmapFeature[]
  firstDay: Date
  lastDay: Date
  // eslint-disable-next-line no-unused-vars
  onChange: (newFeatures: IRoadmapFeature[], newFirstDay: Date) => void
}
