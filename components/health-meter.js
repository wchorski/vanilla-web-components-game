class HealthMeter extends HTMLElement {
	constructor() {
		super()
		this.value = 0.5
		this.label = "myMeter"
		this.hue = "17"
	}

	connectedCallback() {
		this.innerHTML = `
      <style>
        health-meter progress {
          /* --background: transparent; */
          --background: repeating-linear-gradient(
            45deg,
            hsl(0, 0%, 26%),
            hsl(0, 0%, 26%) 5px,
            hsl(0, 0%, 20%) 5px,
            hsl(0, 0%, 22%) 10px
          );
          --optimum: repeating-linear-gradient(
            45deg,
            hsl(var(--color-hue), 100%, 56%),
            hsl(var(--color-hue), 100%, 56%) 5px,
            hsl(var(--color-hue), 100%, 45%) 5px,
            hsl(var(--color-hue), 100%, 42%) 10px
          );
          --sub-optimum: repeating-linear-gradient(
            45deg,
            hsl(179, 100%, 46%),
            hsl(179, 100%, 46%) 10px,
            hsl(179, 100%, 40%) 10px,
            hsl(179, 100%, 42%) 20px
          );
          --sub-sub-optimum: repeating-linear-gradient(
            45deg,
            hsl(179, 100%, 36%),
            hsl(179, 100%, 36%) 10px,
            hsl(179, 100%, 30%) 10px,
            hsl(179, 100%, 32%) 20px
          );
          overflow: hidden;
          -webkit-appearance: none;
          appearance: none;
          -moz-appearance: none;
          background: var(--background);
          display: block;
          margin-bottom: 1em;
          height: 10px;
          width: 100px;
          border: none;
          border-radius: 30px;
        }

        health-meter progress[value] {
          /* Reset the default appearance */
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;

          /* Get rid of default border in Firefox. */
          border: none;

          /* Dimensions */
          /* width: 250px; */
          /* height: 20px; */
        }
        health-meter progress::-webkit-progress-bar {
          background-color: var(
            --background
          ); /* Background of the progress bar (track) */
          border-radius: 15px;
        }
        health-meter progress[value]::-moz-progress-bar {
          background: var(--optimum);
          border-radius: 7px;
          transition-property: color, background, width;
          transition-duration: 0.2s;
          transition-timing-function: ease-in;
        }
        health-meter progress[value]::-webkit-progress-value {
          background: var(--optimum);
          border-radius: 7px;
          transition-property: color, background, width;
          transition-duration: 0.2s;
          transition-timing-function: ease-in;
        }
        
      </style>
      <label>${this.label}</label>
      <progress value="0.79375" max="1" class="meter" ></progress>
    `
		this.meter = this.querySelector(".meter")
		this.meter.value = this.getAttribute("value") || this.value
		this.meter.min = this.getAttribute("min") || 0
		this.meter.max = this.getAttribute("max") || 1.0
		this.meter.style.setProperty(
			"--color-hue",
			this.getAttribute("hue") || this.hue
		)

		const labelEl = this.querySelector("label")
		labelEl.innerText = this.getAttribute("label") || this.label

		// this.updateDirection()
	}

	static get observedAttributes() {
		return ["value", "min", "max", "label", "hue"]
	}
}

customElements.define("health-meter", HealthMeter)
