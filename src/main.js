document.addEventListener('DOMContentLoaded', () => {
    const customProgress = document.querySelector('.custom-progress');

    const progressControl = document.querySelector('.progress-control__fieldset');
    const valueControl = document.querySelector('.progress-control__value');
    const animationControl = document.querySelector('.progress-control__animation');
    const visibilityControl = document.querySelector('.progress-control__visibility');

    progressControl && progressControl.addEventListener('progressControlChanged', handleProgressControl);
    valueControl && valueControl.addEventListener('beforeinput', handleInput);
    animationControl && animationControl.addEventListener('change', handleCheckbox);
    visibilityControl && visibilityControl.addEventListener('change', handleCheckbox);

    function handleProgressControl({ detail }) {

        function handleBooleanControl(attrName, isChecked) {
            if (isChecked) {
                customProgress.setAttribute(attrName, '');
            } else {
                customProgress.removeAttribute(attrName);
            }
        }

        if (detail) {
            const { attrName, value } = detail;

            if (typeof value === 'boolean') {
                handleBooleanControl(attrName, value);
            } else {
                customProgress.setAttribute(attrName, value);
            }
        }
    }

    function handleInput({ target }) {
        const beforeValue = this.value;

        target.addEventListener(
            'input',
            () => {
                if (this.validity.patternMismatch) {
                    this.value = beforeValue;
                } else {
                    dispatchPayload(target.dataset.targetAttr, this.value || 0);
                }
            },
            { once: true }
        );
    }

    function handleCheckbox({ target }) {
        if (target) {
            const { dataset: { targetAttr }, checked } = target;
            dispatchPayload(targetAttr, checked)
        }
    }

    function dispatchPayload(attrName, value) {
        progressControl && progressControl.dispatchEvent(new CustomEvent('progressControlChanged', {
            detail: { attrName, value }
        }));
    }
});
