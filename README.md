# The AugMed App (Frontend)

AugMed is a clinical case review platform for research on AI-augmented medical decision-making. The frontend presents clinicians with de-identified patient cases and collects their diagnostic assessments and clinical recommendations. Researchers control exactly which clinical features each participant sees, enabling controlled experiments on how AI assistance and information disclosure influence clinical judgment. The platform is domain-agnostic — any clinical scenario representable in OMOP format can be studied. The app is built using React, and the backend API is built using Flask and Python.

**Live Website**: **[https://augmed1.dhep.org/](https://augmed1.dhep.org/).**

> **Deploy the full platform:** This frontend is part of a multi-service platform. To deploy everything together (API + Frontend + RL + Database), see the [One-Click Deploy Guide](https://github.com/DHEPLab/augmed-api-v2/blob/main/docs/getting-started/one-click-deploy.md) in the API repository.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Husky](https://img.shields.io/badge/Husky-6C7A89?style=for-the-badge&logo=husky&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![AWS RDS](https://img.shields.io/badge/AWS%20RDS-527FFF?style=for-the-badge&logo=amazon-rds&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-8C4FFF?style=for-the-badge&logo=amazon-s3&logoColor=white)
![AWS ECR](https://img.shields.io/badge/AWS%20ECR-F58534?style=for-the-badge&logo=aws&logoColor=white)
![AWS ECS](https://img.shields.io/badge/AWS%20ECS-FF5A00?style=for-the-badge&logo=aws&logoColor=white)
![AWS ALB](https://img.shields.io/badge/AWS%20ALB-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)

> [!NOTE]
> **Backend Repository**: **[DHEP Lab AugMed Backend](https://github.com/DHEPLab/augmed-api).**

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have [Taskfile](https://taskfile.dev/docs/installation) installed
- You have docker desktop installed
- You have a code editor installed (e.g., [Visual Studio Code](https://code.visualstudio.com/)).
- You have a web browser installed (e.g., Chrome, Firefox).
- You have a tablet or device for testing the app, if applicable.

## Installation

1. **Clone the repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone <repository-url>
   ```
   
2. **Navigate to the project directory**:

    ```bash
    cd AugMed-app
    ```
   
3. **Install dependencies**:

    Run the following command to install the required dependencies:
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Deployment

The app is deployed using AWS services. The deployment process involves the following steps:

1. **Build the app**: Run `npm run build` to create a production build of the app. This is automatically done in the CI/CD pipeline (GitHub Actions).
2. **Push the build to AWS S3**: The build files are uploaded to an S3 bucket for hosting.
3. **Deploy the app using AWS ECS**: The app is deployed to an ECS cluster using a Docker container.
4. **Configure the load balancer**: An Application Load Balancer (ALB) is set up to route traffic to the ECS service.
5. **Set up DNS**: The domain name is configured to point to the ALB.
6. **Monitor the deployment**: The deployment is monitored to ensure that the app is running smoothly.
7. **Update the app**: When updates are made to the app, the deployment process is repeated to push the changes to production.

It also uses Terraform to manage the infrastructure as code.

> [!TIP]
> **Visit the [augmed-infra repository](https://github.com/DHEPLab/augmed-infra) for more details on the infrastructure setup and deployment process.**

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

**Getting cases assigned:** To get cases assigned, please contact the DHEP Lab team. Typically, cases are assigned to participants based on their availability and the lab's research needs.
