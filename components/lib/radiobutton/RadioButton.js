import * as React from 'react';
import { useMountEffect } from '../hooks/Hooks';
import { Tooltip } from '../tooltip/Tooltip';
import { classNames, DomHandler, ObjectUtils } from '../utils/Utils';
import { RadioButtonBase } from './RadioButtonBase';

export const RadioButton = React.memo(
    React.forwardRef((inProps, ref) => {
        const props = RadioButtonBase.getProps(inProps);

        const [focusedState, setFocusedState] = React.useState(false);
        const elementRef = React.useRef(null);
        const inputRef = React.useRef(props.inputRef);

        const select = (event) => {
            onClick(event);
        };

        const onClick = (event) => {
            if (props.disabled) {
                return;
            }

            if (props.onChange || props.onClick) {
                const checked = props.checked;
                const radioClicked = event.target instanceof HTMLDivElement;
                const inputClicked = event.target === inputRef.current;
                const isInputToggled = inputClicked && event.target.checked !== checked;
                const isRadioToggled = radioClicked && (DomHandler.hasClass(elementRef.current, 'p-radiobutton-checked') === checked ? !checked : false);

                if (isInputToggled || isRadioToggled) {
                    const value = !checked;
                    const eventData = {
                        originalEvent: event,
                        value: props.value,
                        checked: value,
                        stopPropagation: () => {
                            event.stopPropagation();
                        },
                        preventDefault: () => {
                            event.preventDefault();
                        },
                        target: {
                            type: 'radio',
                            name: props.name,
                            id: props.id,
                            value: props.value,
                            checked: value
                        }
                    };

                    props.onClick && props.onClick(eventData);

                    // do not continue if the user defined click wants to prevent
                    if (event.defaultPrevented) {
                        return;
                    }

                    props.onChange && props.onChange(eventData);

                    if (isRadioToggled) {
                        inputRef.current.checked = value;
                    }
                }

                DomHandler.focus(inputRef.current);
                event.preventDefault();
            }
        };

        const onFocus = () => {
            setFocusedState(true);
        };

        const onBlur = () => {
            setFocusedState(false);
        };

        const onKeyDown = (event) => {
            if (event.code === 'Space' || event.key === ' ') {
                // event.key is for Android support
                onClick(event);
            }
        };

        React.useEffect(() => {
            if (inputRef.current) {
                inputRef.current.checked = props.checked;
            }
        }, [props.checked]);

        React.useEffect(() => {
            ObjectUtils.combinedRefs(inputRef, props.inputRef);
        }, [inputRef, props.inputRef]);

        useMountEffect(() => {
            if (props.autoFocus) {
                DomHandler.focus(inputRef.current, props.autoFocus);
            }
        });

        React.useImperativeHandle(ref, () => ({
            props,
            select,
            focus: () => DomHandler.focus(inputRef.current),
            getElement: () => elementRef.current,
            getInput: () => inputRef.current
        }));

        const hasTooltip = ObjectUtils.isNotEmpty(props.tooltip);
        const otherProps = RadioButtonBase.getOtherProps(props);
        const ariaProps = ObjectUtils.reduceKeys(otherProps, DomHandler.ARIA_PROPS);
        const className = classNames(
            'p-radiobutton p-component',
            {
                'p-radiobutton-checked': props.checked,
                'p-radiobutton-disabled': props.disabled,
                'p-radiobutton-focused': focusedState
            },
            props.className
        );
        const boxClassName = classNames('p-radiobutton-box', {
            'p-highlight': props.checked,
            'p-disabled': props.disabled,
            'p-focus': focusedState
        });

        return (
            <>
                <div ref={elementRef} id={props.id} className={className} style={props.style} {...otherProps} onClick={onClick}>
                    <div className="p-hidden-accessible">
                        <input
                            ref={inputRef}
                            id={props.inputId}
                            type="radio"
                            name={props.name}
                            defaultChecked={props.checked}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onKeyDown={onKeyDown}
                            disabled={props.disabled}
                            required={props.required}
                            tabIndex={props.tabIndex}
                            {...ariaProps}
                        />
                    </div>
                    <div className={boxClassName}>
                        <div className="p-radiobutton-icon"></div>
                    </div>
                </div>
                {hasTooltip && <Tooltip target={elementRef} content={props.tooltip} {...props.tooltipOptions} />}
            </>
        );
    })
);

RadioButton.displayName = 'RadioButton';
