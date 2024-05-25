import { Form, Input } from 'antd'
import './form.css'
import React, { Component } from 'react'

export default class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
  }

  componentDidMount() {
    this.textInput.current.focus()
  }

  render() {
    const { onInputChange } = this.props

    return (
      <Form className="search-form">
        <Input placeholder="Type to search..." onChange={onInputChange} ref={this.textInput} />
      </Form>
    )
  }
}
