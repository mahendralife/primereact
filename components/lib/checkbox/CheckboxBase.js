import { ObjectUtils } from '../utils/Utils';

export const CheckboxBase = {
    defaultProps: {
        __TYPE: 'Checkbox',
        autoFocus: false,
        checked: false,
        className: null,
        disabled: false,
        falseValue: false,
        icon: null,
        id: null,
        inputId: null,
        inputRef: null,
        name: null,
        onChange: null,
        onClick: null,
        onContextMenu: null,
        onMouseDown: null,
        readOnly: false,
        required: false,
        style: null,
        tabIndex: null,
        tooltip: null,
        tooltipOptions: null,
        trueValue: true,
        value: null,
        children: undefined
    },
    getProps: (props) => ObjectUtils.getMergedProps(props, CheckboxBase.defaultProps),
    getOtherProps: (props) => ObjectUtils.getDiffProps(props, CheckboxBase.defaultProps)
};
