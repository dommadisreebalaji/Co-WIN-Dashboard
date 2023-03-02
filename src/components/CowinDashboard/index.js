// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusValues = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    data: {},
    apiStatus: apiStatusValues.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusValues.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const convertData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination,
        vaccinationByAge: fetchedData.vaccination_by_age,
        vaccinationByGender: fetchedData.vaccination_by_gender,
      }

      this.setState({
        data: convertData,
        apiStatus: apiStatusValues.success,
      })
    } else {
      this.setState({apiStatus: apiStatusValues.failure})
    }
  }

  renderPage = () => {
    const {data} = this.state
    const {last7DaysVaccination, vaccinationByGender, vaccinationByAge} = data
    return (
      <>
        <VaccinationCoverage VaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-msg">Something went wrong</h1>
    </div>
  )

  apiView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusValues.success:
        return this.renderPage()
      case apiStatusValues.pending:
        return this.loadingView()
      case apiStatusValues.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="logo-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p className="text">Co-WIN</p>
        </div>
        <h1 className="app-heading">CoWIN Vaccination in India</h1>
        <div className="graphs-container">{this.apiView()}</div>
      </div>
    )
  }
}

export default CowinDashboard
