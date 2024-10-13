class ProjectTimeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.projects = JSON.parse(this.getAttribute('projects')) || [];
    this.render();
  }


  processData() {
    const events = [];


    this.projects.forEach((project, index) => {
      events.push({ date: new Date(project.start), type: 'start' });
      events.push({ date: new Date(project.end), type: 'end', projectIndex: index });
    });

    // Sort events
    events.sort((a, b) => a.date - b.date || (a.type === 'end' ? -1 : 1));

    const intervals = [];
    let activeProjects = 0;
    let lastDate = events[0].date;

    events.forEach((event, i) => {
      if (event.date > lastDate) {
        intervals.push({
          start: lastDate,
          end: event.date,
          activeProjects,
        });
        lastDate = event.date;
      }

      activeProjects += event.type === 'start' ? 1 : -1;

      // Handle branches for project ends
      if (event.type === 'end') {
        intervals.push({
          date: event.date,
          type: 'branch',
          projectIndex: event.projectIndex,
        });
      }
    });

    this.intervals = intervals;
  }

  render() {
    this.processData();

    const svgNS = 'http://www.w3.org/2000/svg';
    const width = 800;
    const height = 200;
    const padding = 50;

    // Calculate the overall timeline duration
    const dates = this.intervals
      .filter(interval => interval.start)
      .flatMap(interval => [interval.start, interval.end]);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    console.log("minDate:", minDate);
    console.log("maxDate:", maxDate);
    const timeSpan = maxDate - minDate;

    // Create SVG element
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);

    // Background
    const background = document.createElementNS(svgNS, 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', height);
    background.setAttribute('fill', '#fff');
    svg.appendChild(background);

    // Create a <defs> element to hold the gradient definition
    const defs = document.createElementNS(svgNS, 'defs');

    // Define the linear gradient
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'trunkGradient');
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0');
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse'); // Use the same coordinate system as the lines

    // Define the start and end of the gradient
    const startColor = document.createElementNS(svgNS, 'stop');
    startColor.setAttribute('offset', '0%');
    startColor.setAttribute('stop-color', '#99FF99'); // Start of timeline (brown)

    const endColor = document.createElementNS(svgNS, 'stop');
    endColor.setAttribute('offset', '100%');
    endColor.setAttribute('stop-color', '#330000'); // End of timeline (golden)

    // Append the gradient stops to the gradient element
    gradient.appendChild(startColor);
    gradient.appendChild(endColor);

    // Append the gradient to the <defs> section
    defs.appendChild(gradient);
    svg.appendChild(defs);

    function getColorAtDate(dateStr) {

      var date = new Date(dateStr)

      
      if (!(date instanceof Date)) {
        console.error(`Invalid date object passed to getColorAtDate: ${date}`);
        return 'rgb(0, 0, 0)'; // Fallback color in case of invalid dates
      }
      if (!(minDate instanceof Date)){
        console.error(`Invalid min date object passed to getColorAtDate: ${minDate}`);
        return 'rgb(0, 0, 0)'; // Fallback color in case of invalid dates
      }

      // Calculate the relative position (0 to 1) of the date in the timeline
      const position = (date - minDate) / timeSpan;

      if (isNaN(position) || position < 0 || position > 1) {
        console.error("Position calculation is out of bounds or NaN");
        return 'rgb(0, 0, 0)'; // Fallback color for invalid position
      }

      // Interpolate between the start color (#8B4513) and the end color (#DAA520)
      const startRGB = [153, 255, 153]; // RGB for #8B4513
      const endRGB = [51, 0, 0];  // RGB for #DAA520

      // Interpolate the color values based on the position
      const r = Math.round(startRGB[0] + position * (endRGB[0] - startRGB[0]));
      const g = Math.round(startRGB[1] + position * (endRGB[1] - startRGB[1]));
      const b = Math.round(startRGB[2] + position * (endRGB[2] - startRGB[2]));

      return `rgb(${r},${g},${b})`; // Return the interpolated color as an RGB string
    }

    // Draw trunk lines
    this.intervals.forEach(interval => {
      if (interval.start) {
        const x1 = padding + ((interval.start - minDate) / timeSpan) * (width - 2 * padding);
        const x2 = padding + ((interval.end - minDate) / timeSpan) * (width - 2 * padding);
        const thickness = 5 + interval.activeProjects * 5; // Adjust thickness scale as needed
        const y = height / 2;

        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'url(#trunkGradient)'); // Apply the gradient as stroke
        line.setAttribute('stroke-width', thickness);
        line.setAttribute('stroke-linecap', 'round');

        // Append the line to the SVG
        svg.appendChild(line);
      }

      // Draw branches
      if (interval.type === 'branch') {
        const x = padding + ((interval.date - minDate) / timeSpan) * (width - 2 * padding);
        const y1 = height / 2;
        const y2 = y1 - 30; // Length of the branch

        const branch = document.createElementNS(svgNS, 'line');
        branch.setAttribute('x1', x);
        branch.setAttribute('y1', y1);
        branch.setAttribute('x2', x);
        branch.setAttribute('y2', y2);

        // Set branch color based on the start date's corresponding timeline color
        const branchColor = getColorAtDate(this.projects[interval.projectIndex].start);
        console.log(branchColor)
        branch.setAttribute('stroke', branchColor);
        branch.setAttribute('stroke-width', 2);
        svg.appendChild(branch);

        // Optional: Add labels
        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', x + 5);
        label.setAttribute('y', y2 - 5);
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#000');
        label.textContent = this.projects[interval.projectIndex].name || `Project ${interval.projectIndex + 1}`;
        svg.appendChild(label);

        console.log("Intervals:", this.intervals);

      }
      
    });

    // Time axis (optional)
    const axis = document.createElementNS(svgNS, 'line');
    axis.setAttribute('x1', padding);
    axis.setAttribute('y1', height - 20);
    axis.setAttribute('x2', width - padding);
    axis.setAttribute('y2', height - 20);
    axis.setAttribute('stroke', '#000');
    axis.setAttribute('stroke-width', 1);
    svg.appendChild(axis);

    // Axis labels
    [minDate, maxDate].forEach((date, index) => {
      const x = index === 0 ? padding : width - padding;
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', height - 5);
      label.setAttribute('font-size', '12');
      label.setAttribute('text-anchor', index === 0 ? 'start' : 'end');
      label.textContent = date.toISOString().split('T')[0];
      svg.appendChild(label);
    });

    // Clear previous content and attach SVG
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(svg);
    const style = document.createElement('style');
    style.textContent = `
        svg {
            width: 100%;
        }
        text {
            font-family: Arial, sans-serif;
        }
    `;
    this.shadowRoot.appendChild(style);
  }





}

customElements.define('project-timeline', ProjectTimeline);

