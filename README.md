Topic: ReactTS <br />
Submission Date: 14 October 2026 <br />
Time: 09:00 AM


Please submit by pushing to your GitHub repository and creating a pull request to your mentor

# Title: Task 4 - React Weather App

## Objective
It’s very rare for a whole application with a complete ecosystem to never communicate with other applications or servers to either send or request information. Most of these communications are done through APIs. In this task we focus on the consumption of data from third party servers which we then need to display in our own application. 

### This is the fourth official task for React based on Lesson 4.

<strong>Scenario</strong>: You have to create a weather app that allows users to see their current location’s weather as well as any other location they search for. Their location and searched locations need to be persisted so they don’t have to keep searching the same location over and over.

## Requirements

### User Interface
1. Create a user-friendly interface that is intuitive and easy to use
2. Allow users to view weather conditions such as temperature, humidity, wind speed in a set location
3. The interface should have an appropriate page with appropriate elements to display the weather

### Features
1. Real-time Weather Info:
   - Display current weather conditions (temperature, humidity, wind speed, etc.).
   - Provide hourly and daily weather forecasts.
   - Allow users to select whether to view overall daily weather or hourly weather.
2. Location-Based Forecasting:
   - The app should automatically detect the user’s location, if granted permission by the user. 
   - Allow users to search for a location
   - Provide weather information for the user's current location
   - Provide weather information for the searched location
3. Weather Alerts:
   - Send local notifications for severe weather alerts in the user's location.
4. Multiple Locations:
   - Allow users to save and switch between multiple locations for weather information.
5. Customization:
   - Allow users to customise the app's theme
   - Allow users to customise the display units (e.g., Celsius vs. Fahrenheit).
6. Offline Access:
   - Provide cached weather data for offline access.
7. Performance:
   - Optimise the app for fast loading and smooth performance.
8. Privacy & Security:
   - Protect user data and privacy in accordance with relevant laws and regulations.

### Evaluation Criteria:
1. User-friendliness and visual appeal of the design
    - Is the design intuitive
    - Does the design have a proper and understandable layout
    - Does the app flow from one function to another in an understandable and easy to follow manner
    - Does the app show notifications for processes occurring in the background and after an operation
    - Does the design have colors that blend well together
    - Does the design maintain a consistent typography
2. Functionality
    - App requests to read user’s location
    - Does the app allow user to search for a location
    - Does the app show the weather details such as:
        - Temperature
        - Humidity
        - Wind speed
    - Does the app allow user to change the theme
    - Does the app allow the user to change the display units?
    - Does the app allow the user to see hourly weather
    - Does the app allow the user to see daily weather
3. Page interactivity
    - The mouse cursor changes when hovering over clickable elements
    - Clickable elements change color when hovered over to indicate interactivity
    - It is easy to navigate through the application’s different pages
4. Utilisation of ReactTS features
    - Did trainee create their own components
    - Were the components reused where appropriate
    - Was React state utilised properly
    - Were props sent and handled properly
    - Components are customised through props for similar design elements instead of creating new elements
    - Code quality and code organisation
    - Variable names follow the standard and recommended naming approach, camelCasing
    - Variable names are self-explanatory
    - Logic is broken into smaller code blocks (functions) making it more readable
    - Comments utilised where necessary
5. Responsiveness of the page
    - Is the page responsive to different web view sizes at these common breakpoints:
       - 320px
       - 480px
       - 768px
       - 1024px
       - 1200px

### Instructions:
1. Create a React project to address this problem or use case. You are expected to come up with your own design.
2. Make use of reusable components wherever applicable
3. Make it responsive to different screen sizes.
4. The main point of data storage will be local storage (localStorage directly available from JS), which will allow you to add, update and delete from it.
5. You are allowed to use libraries in this project as long as they do not get in the way of you addressing the requirements of the app. Eg Tailwind for CSS
6. You are to submit in the form of links, either a github link or live link of the portal. Sending code files will not count as a submission.
7. It is recommended that everyone uses react-router-dom version 6 for the task so it is easier for everyone to help one another in the case of bugs/errors etc. npm automatically will select this version if you do not specify the version.

### Deliverables
1. Design
2. Step by step planning
3. Pseudocode
4. UI implementation
5. Algorithm
