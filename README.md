
# SpaceXplorer

This project is a dynamic web application that demonstrates interactive features such as map visualizations, 3D globe rendering, and responsive carousels, leveraging modern web technologies.

---

## Features

### Core Functionalities
- **Interactive Maps**: Display geographic data and points of interest using Leaflet and React-Leaflet.
- **3D Globe Visualizations**: Render a globe with data overlays using React Globe GL.
- **Embedded Media**: Seamless integration of YouTube videos for multimedia content.
- **Dynamic Carousels**: Showcase images and data interactively using React Responsive Carousel.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views using Tailwind CSS.
- **Date and Time Management**: Efficient date handling with Moment.js.

### Additional Features
- **Material UI Integration**: Enhanced user interface with Material UI components and icons.
- **API Integration**: Fetch and display data dynamically using Axios.
- **Client-Side Routing**: Smooth navigation between views with React Router DOM.

---

## Technologies Used

### Frontend Libraries
- **React.js**: Core framework for building user interfaces.
- **Leaflet & React-Leaflet**: Interactive map visualizations.
- **React Globe GL**: 3D globe rendering.
- **React Responsive Carousel**: Image and content carousels.
- **React YouTube**: Embedded YouTube videos.
- **Moment.js**: Date and time manipulation.
- **Material UI**: UI components and icons.

### Development Tools
- **Vite**: Fast development and build tooling.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **ESLint**: Code linting for JavaScript and React.
- **PostCSS**: CSS processing.

---

## Prerequisites

Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

---

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SKele10/SpaceXplorer.git
   cd cs-554-lab-5
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
/
|-- public/                 # Static assets (images, icons, etc.)
|-- src/                    # Source code
|   |-- components/         # Reusable React components
|   |-- pages/              # Page-level components
|   |-- App.jsx             # Main application component
|-- index.html              # Main HTML file
|-- package.json            # Project dependencies and metadata
|-- tailwind.config.js      # Tailwind CSS configuration
|-- vite.config.js          # Vite configuration
```

---

## Deployment

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Serve the Production Build**:
   Use any web server or hosting platform to serve the files in the `dist` folder. Examples include:
   - [Netlify](https://www.netlify.com/)
   - [Vercel](https://vercel.com/)
   - [AWS S3](https://aws.amazon.com/s3/)

