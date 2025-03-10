class CustomProgress extends HTMLElement {

    static get attributesMap() {
        return {
            animated: {
                isBoolean: true,
                setValue(isAnimated) {
                    this.style.animationPlayState = isAnimated ? 'running' : 'paused';
                }
            },
            hidden : {
                isBoolean: true,
                setValue(isHidden) {
                    this.style.display = isHidden ? 'none' : 'grid';
                }
            },
            value: {
                setValue(progressValue) {
                    if (progressValue) {
                        this.style.setProperty('--progress-value', `${progressValue}%`);
                    }
                }
            },
        }
    };

    static get observedAttributes() {
        return Object.keys(this.attributesMap);
    }

    _styleCSS = `
    :host {
        --size: 7.5rem;
        --bar-width: 0.75rem;

        --fill-color: #005dff;
        --rest-color: #eef3f6;
        
        --rotate-duration: 3s;
    }

    .progress {
        --donat-width: calc(100% - var(--bar-width));
        --donat-mask: radial-gradient(
            farthest-side,
            transparent var(--donat-width),
            #fff var(--donat-width)
        );

        display: grid;
        place-items: center;
        width: var(--size);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background: conic-gradient(
            var(--fill-color) var(--progress-value, 0),
            var(--rest-color) var(--progress-value, 0)
        );
        -webkit-mask: var(--donat-mask);
                mask: var(--donat-mask);
                
        animation: var(--rotate-duration) linear infinite paused rotate;
    }
        
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }`;

    constructor() {
        super();
    }

    setCustomAttribute(name, params) {
        const progressEl = this.shadowRoot?.querySelector('.progress');

        if (progressEl) {
            const value = new CustomAttribute(name, params?.isBoolean).getValue(this);
            params.setValue?.call(progressEl, value);
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        const progressEl = document.createElement('div');
        progressEl.setAttribute('class', 'progress');

        const style = document.createElement('style');
        style.textContent = this._styleCSS;

        shadow.appendChild(style);
        shadow.appendChild(progressEl);

        if (CustomProgress.observedAttributes.length) {
            for (const [name, params] of Object.entries(CustomProgress.attributesMap)) {
                this.setCustomAttribute(name, params);
            }
        }
    }

    attributeChangedCallback(name) {
        this.setCustomAttribute(name, CustomProgress.attributesMap[name]);
    }
}

class CustomAttribute {
    name;
    isBoolean;

    constructor(name, isBoolean = false) {
        this.name = name;
        this.isBoolean = isBoolean;
    }

    getValue(element) {
        return this.isBoolean ? element.hasAttribute(this.name) : element.getAttribute(this.name);
    }
}

customElements.define('custom-progress', CustomProgress);