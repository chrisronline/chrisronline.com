import React, { useCallback, useRef, useState } from 'react';
import { debounce } from '../lib';
import './form.scss';

enum FormFields {
  email = 'email',
  password = 'password',
}

type FormValidity = {
  [key in FormFields]: { state: ValidityState; message: string | null };
};

function getErrorMessage(field: FormFields, validity: ValidityState): string | null {
  if (validity.valid) return null;


  if (field === FormFields.email) {
    if (validity.valueMissing) return 'This field is required';
    if (validity.patternMismatch) return 'Invalid email';
    return 'Generic invalid email';
  }

  if (field === FormFields.password) {
    if (validity.valueMissing) return 'This field is required';
    return 'Generic password failure';
  }

  return null;
}

export const FormReact = () => {
  const formRef = useRef<HTMLFormElement>();
  const [showError, setShowErrors] = useState(false);
  const [validity, setValidity] = useState<FormValidity>();

  const revalidate = useCallback(debounce(() => {
    const newValidity = { ...validity };
    const elements = formRef.current.elements;
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i) as HTMLInputElement;
      if (element.nodeType === Node.ELEMENT_NODE) {
        if (!element.validity.valid) {
          newValidity[element.id as FormFields] = {
            state: element.validity,
            message: getErrorMessage(element.id as FormFields, element.validity),
          };
        }
      }
    }
    setValidity(newValidity);
  }, 300, true), [validity, formRef.current]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowErrors(true);
    revalidate();
  }
  return (
    <section className="form-wrapper">
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate={true}
        className={showError ? 'form-show-errors' : ''}
      >
        <div className="form-row">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="text"
            id="email"
            required={true}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            onChange={revalidate}
          />
          {validity?.email?.state.valid === false ? (
            <span className="form-input-error">{validity.email.message}</span>
          ) : null}
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            required={true}
            onChange={revalidate}
          />
          {validity?.password?.state.valid === false ? (
            <span className="form-input-error">{validity.password.message}</span>
          ) : null}
        </div>
        <div className="form-row form-btns-row">
          <button className="form-btn">Login</button>
          <a className="form-link" href="#">
            Forgot password?
          </a>
        </div>
      </form>
    </section>
  );
};
