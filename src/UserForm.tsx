import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios"; 

type PersonData = {
  name: string,
  surname: string,
  country: string,
  email: string,
  gender: string,
}

type ErrorMsgs = {
  name?: string;
  surname?: string;
  email?: string;
}


class UserForm extends React.Component<{}, {isSumbitBtnOff: boolean;}> {

  constructor(props: boolean) {
    super(props);
    this.state = { 
      isSumbitBtnOff: true,
    };
  }

  initialValues: PersonData = {
    name: '',
    surname: '',
    country: '',
    email: '',
    gender: ''
  }

  validate = (values:PersonData):ErrorMsgs => {
    const errors = {} as ErrorMsgs;
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length < 3) {
      errors.name = 'At least 3 characters';
    }
  
    if (!values.surname) {
      errors.surname = 'Required';
    } else if (values.surname.length > 20) {
      errors.surname = 'No more than 20 characters';
    }
    
    return errors;
  };
  
  validateEmail = async (value: string):Promise<string> => {
    this.setState({ isSumbitBtnOff: true }) 
    let error = "";
    if (!value) {
      error = 'Required';
    }else{
      const response:any = await axios.get(`api/email-validator.php?email=${value}`); // bypass for CORS; api instead https://extensi.io
      let isValid:boolean = response.data.validation_status;
      if (!isValid) {
        error = "Invalid e-mail address";
      }
    }
    (!error ? this.setState({ isSumbitBtnOff: false }) : null);
    return error;
  }

  render() {
    return (
      <div className='row'>
        <div className='d-flex flex-column min-vh-100 justify-content-center align-items-center'>
        <div className='col-6'>
          <Formik
            initialValues={this.initialValues}
            validate={this.validate}
            onSubmit={(values, actions) => {
              console.log({ values, actions });
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }}
          >
            {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">Name*</label>
                <Field className="form-control" id="name" name="name" aria-label="name"/>
                <ErrorMessage name="name" component={errors.name} >{error => <div className="text-danger">{error}</div>}</ErrorMessage>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="surname">Surname*</label>
                <Field className="form-control" id="surname" name="surname" aria-label="surname"/>
                <ErrorMessage name="surname" component={errors.surname} >{error => <div className="text-danger">{error}</div>}</ErrorMessage>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="country">Country</label>
                <Field className="form-control" id="country" name="country" aria-label="country"/>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">E-mail*</label>
                <Field className="form-control" id="email" name="email" aria-label="email" validate={this.validateEmail}/>
                <ErrorMessage name="email" component={errors.email} >{error => <div className="text-danger">{error}</div>}</ErrorMessage>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="gender">Gender</label>
                <div className="form-check">
                  <label className="form-check-label" htmlFor="man">Man</label>
                  <Field className="form-check-input" type="radio" name="gender" id="man" value="man" />
                </div>
                <div className="form-check">
                  <label className="form-check-label" htmlFor="female">Female</label>
                  <Field className="form-check-input" type="radio" name="gender" id="female" value="female" />
                </div>
                <div className="form-check">
                  <label className="form-check-label" htmlFor="other">Other</label>
                  <Field className="form-check-input" type="radio" name="gender" id="other" value="other" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={this.state.isSumbitBtnOff} aria-label="submit">Submit</button>
            </Form>
            )}
          </Formik>
        </div>
        </div>
      </div>
    );
  }
}

export default UserForm;