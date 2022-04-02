import React, { useState } from 'react';
import './phone_input.scss';

enum InputType {
  DELETE_CONTENT_BACKWARDS = 'deleteContentBackward',
}

function format(value: string, inputType: string) {
  if (
    value.startsWith('(') &&
    !value.endsWith(')') &&
    value.length <= 4 &&
    inputType === InputType.DELETE_CONTENT_BACKWARDS
  ) {
    value = value.substring(0, value.length - 1);
  }

  const numberAsString = value.replace(/\D+/g, '');
  let areaCode = ''; // 0,1,2
  let firstPart = ''; // 3,4,5
  let secondPart = ''; // 6,7,8,8
  for (let i = 0; i < numberAsString.length; i++) {
    if (i < 3) {
      areaCode += numberAsString[i];
    } else if (i < 6) {
      firstPart += numberAsString[i];
    } else if (i < 10) {
      secondPart += numberAsString[i];
    }
  }

  let formatted = '';
  if (areaCode.length === 3) {
    formatted += `(${areaCode})`;
  } else {
    formatted = numberAsString;
  }
  if (firstPart.length > 0) {
    formatted += firstPart;
  }
  if (secondPart.length > 0) {
    formatted += '-' + secondPart;
  }

  return formatted;
}

export const PhoneInputReact = () => {
  const [formatted, setFormatted] = useState<string>('');

  function onTypeNumber(event: React.ChangeEvent<HTMLInputElement>) {
    setFormatted(
      format(event.target.value, (event.nativeEvent as InputEvent).inputType)
    );
  }

  return (
    <article className="phone_input">
      <input
        type="text"
        value={formatted}
        onChange={onTypeNumber}
        className="phone_input_number"
      />
    </article>
  );
};
