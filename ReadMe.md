# ProjectTimeline Web Component

`ProjectTimeline` is a custom web component that renders a timeline of projects with branches representing project milestones. Each project is visualized along a horizontal timeline, and the color of branches reflects the project's start date, transitioning between two contrasting colors along the timeline.

## Features

- Visualizes multiple projects with start and end dates on a timeline.
- Displays branch lines for individual projects.
- Uses dynamic color gradients to reflect the project's relative position on the timeline.
- Fully customizable width, height, and project data.

## Demo

![Project Timeline Demo](demo.png)

## Installation

You can include this component by importing the JavaScript file directly into your project:

```html
<script src="path/to/project-timeline.js"></script>
```

Alternatively, you can integrate it via a module system like ES6:

```javascript
import './project-timeline.js';
```

## Usage

To use the `ProjectTimeline` component in your HTML, simply define the component tag and provide the required `projects` data in JSON format as an attribute.

```html
<project-timeline projects='[
  { "name": "Project 1", "start": "2023-01-01", "end": "2023-06-01" },
  { "name": "Project 2", "start": "2023-03-15", "end": "2023-09-15" },
  { "name": "Project 3", "start": "2023-05-01", "end": "2023-12-01" }
]'></project-timeline>
```

### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Timeline Demo</title>
    <script src="project-timeline.js"></script>
</head>
<body>
    <h1>Project Timeline Example</h1>

    <project-timeline projects='[
      { "name": "Alpha", "start": "2023-01-01", "end": "2023-04-01" },
      { "name": "Beta", "start": "2023-02-01", "end": "2023-08-01" },
      { "name": "Gamma", "start": "2023-03-01", "end": "2023-12-01" }
    ]'></project-timeline>
</body>
</html>
```

## Attributes

- **projects**: A required attribute that takes a JSON string representing an array of projects. Each project object must contain:
  - `name`: The name of the project (optional).
  - `start`: The project's start date (required).
  - `end`: The project's end date (required).

### Example Project Data Format

```json
[
  { "name": "Project Alpha", "start": "2023-01-01", "end": "2023-04-01" },
  { "name": "Project Beta", "start": "2023-02-01", "end": "2023-07-01" }
]
```

## Customization

You can modify the following properties in the JavaScript file for custom behavior or styles:

- **Width** and **Height**: Adjust the size of the SVG element for the timeline.
- **Gradient Colors**: Modify the start and end colors for the timeline and branches in the `getColorAtDate()` function.

### Changing Timeline Colors

The gradient is defined using two contrasting colors. You can update these colors inside the `getColorAtDate()` function:

```javascript
const startRGB = [0, 255, 0];  // Bright Green
const endRGB = [255, 0, 0];    // Bright Red
```

## Development

If you want to modify the component, clone this repository and edit `project-timeline.js`.

### Running Locally

To run the component locally, just open the HTML file in a browser:

```bash
open index.html
```

You can test with different project data by modifying the `projects` attribute in the example HTML file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
