var ContactForm = React.createClass({
  displayName: "ContactForm",

  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  render: function() {
    var oldContact = this.props.value
    var onChange = this.props.onChange

    return (
      React.createElement("form", { className: "form-horizontal" },
        React.createElement("div", { className: "form-group" },
          React.createElement(
            "label", {
              className: "control-label col-sm-3",
              htmlFor: "name"
            },
            "Name"
          ),
          React.createElement("div", { className: "col-sm-9" },
            React.createElement(
              "input", {
                className: "form-control",
                id: "name",
                onChange: function (event) {
                  onChange(Object.assign({}, oldContact, { name: event.target.value }))
                },
                placeholder: "Required",
                type: "text",
                value: this.props.value.name
              }
            )
          )
        ),
        React.createElement("div", { className: "form-group" },
          React.createElement(
            "label", {
              className: "control-label col-sm-3",
              htmlForm: "emailAddress"
            },
            "Email address"
          ),
          React.createElement("div", { className: "col-sm-9" },
            React.createElement("input", {
                className: "form-control",
                id: "emailAddress",
                onChange: function (event) {
                  onChange(Object.assign({}, oldContact, { emailAddress: event.target.value }))
                },
                type: "email",
                value: this.props.value.emailAddress
              }
            )
          )
        ),
        React.createElement("div", { className: "form-group" },
          React.createElement(
            "label", {
              className: "control-label col-sm-3",
              htmlFor: "description"
            },
            "Description"
          ),
          React.createElement("div", { className: "col-sm-9" },
            React.createElement(
              "textarea", {
                className: "form-control",
                id: "description",
                onChange: function (event) {
                  onChange(Object.assign({}, oldContact, { description: event.target.value }))
                },
                rows: 2,
                value: this.props.value.description
              }
            )
          )
        ),
        React.createElement("div", { className: "form-group" },
          React.createElement("div", { className: "col-sm-offset-3 col-sm-9" },
            React.createElement(
              "button", {
                className: "btn btn-primary",
                type: "submit"
              },
              "Add contact"
            )
          )
        )
      )
    )
  }
})

var ContactRow = React.createClass({
  displayName: "ContactRow",

  propTypes: {
    name: React.PropTypes.string.isRequired,
    emailAddress: React.PropTypes.string.isRequired,
    description: React.PropTypes.string
  },

  render: function() {
    return (
      React.createElement("tr", {},
        React.createElement("td", {}, this.props.name),
        React.createElement("td", {},
          React.createElement("a", { href: "mailto:" + this.props.emailAddress }, this.props.emailAddress)
          ),
        React.createElement("td", {}, this.props.description)
      )
    )
  },
})

var ContactsView = React.createClass({
  displayName: "ContactsView",

  propTypes: {
    contacts: React.PropTypes.array.isRequired,
    newContact: React.PropTypes.object.isRequired,
    onNewContactChange: React.PropTypes.func.isRequired
  },

  render: function() {
    var contactRows = this.props.contacts
      .filter(function (contact) { return contact.emailAddress })
      .map(function(contact) { return React.createElement(ContactRow, contact) })

    var onContactsChange = this.props.onContactsChange

    return (
      React.createElement("div", { className: "container" },
        React.createElement("h1", {}, "Contacts"),
        React.createElement("table", { className: "table" },
          React.createElement("thead", {},
            React.createElement("tr", {},
              React.createElement("th", {}, "Name"),
              React.createElement("th", {}, "Email address"),
              React.createElement("th", {}, "Description")
            )
          ),
          React.createElement("tbody", {}, contactRows)
        ),
        React.createElement(ContactForm, {
          value: newContact,
          onChange: this.props.onNewContactChange
        })
      )
    )
  }
})

var contacts = [
  { key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn" },
  { key: 2, name: "Jim", emailAddress: "jim@example.com" },
  { key: 3, name: "Joe" },
  { key: 4, name: "Jan", emailAddress: "jan@aagaard.net", description: "CPNHGN" }
]

var newContact = {
  name: "",
  emailAddress: "",
  description: ""
}

ReactDOM.render(
  React.createElement(ContactsView, {
    contacts: contacts,
    newContact: newContact,
    onNewContactChange: function(contact) {
      console.debug(contact)
    }
  }),
  document.getElementById("rootElement")
)