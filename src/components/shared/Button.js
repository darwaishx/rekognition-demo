import React from 'react'

import cs from 'classnames';
import s from './Button.module.css';

export default function Button({
  Component = 'button',
  className,
  danger,
  round,
  ...rest
}) {
  return (
    <Component className={cs(className, s.base, danger && s.danger, round && s.round)} {...rest} />
  )
}
